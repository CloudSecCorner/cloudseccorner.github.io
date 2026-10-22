defmodule CloudSecurityCorner.Content do
  use GenServer

  @page_size 24

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  def init(:ok) do
    data = %{
      tools: read_json!("security-entries.json"),
      blogs: read_json!("blog.json")["blogs"],
      labs: read_json!("labs.json")["labs"]
    }

    {:ok, data}
  end

  def tools, do: GenServer.call(__MODULE__, :tools)
  def blog_posts, do: GenServer.call(__MODULE__, :blogs)
  def labs, do: GenServer.call(__MODULE__, :labs)
  def tool_count, do: length(tools())

  def lab_categories do
    labs()
    |> Enum.map(& &1["category"])
    |> Enum.reject(&is_nil/1)
    |> Enum.uniq()
    |> Enum.sort()
  end

  def search_labs(query, category) do
    query = String.downcase(query)

    labs()
    |> Enum.filter(fn lab ->
      category_matches?(lab, category) and
        Enum.any?(
          [lab["title"], lab["description"], lab["category"]] ++ (lab["tags"] || []),
          fn value ->
            String.contains?(String.downcase(value || ""), query)
          end
        )
    end)
  end

  @curated_categories [
    %{
      id: "agentic-ai",
      label: "Agentic & AI Security",
      short_label: "Agentic & AI",
      icon: "🤖",
      description:
        "AI agent guardrails, sandboxing, MCP security, LLM red teaming, and autonomous workload governance.",
      regex:
        ~r/\bagentic\b|\bagent\b|\bmcp\b|\bllm\b|\bllms\b|\blangchain\b|prompt inject|guardrail|\bopenai\b|\banthropic\b|\bai security\b|\bai testing\b|artificial intelligence/i
    },
    %{
      id: "cloud-container",
      label: "Cloud & Container Security",
      short_label: "Cloud & Containers",
      icon: "☁️",
      description:
        "Kubernetes security, container isolation, Docker, AWS/Azure/GCP posture, CSPM, and cloud workload protection.",
      regex:
        ~r/kubernetes|docker|container|k8s|cloud security|aws|azure|gcp|cspm|ciem|helm|pod security|workload protection/i
    },
    %{
      id: "app-api",
      label: "Application & API Security",
      short_label: "App & API Sec",
      icon: "🛡️",
      description:
        "Web application firewalls (WAF), API protection, DAST, SAST, XSS/SQLi defense, and OWASP Top 10 auditing.",
      regex:
        ~r/web security|web application|application security|api security|waf|dast|sast|xss|sql injection|csrf|cors|graphql|ssrf|burp|owasp/i
    },
    %{
      id: "devsecops-supplychain",
      label: "DevSecOps & Supply Chain",
      short_label: "DevSecOps",
      icon: "📦",
      description:
        "Software supply chain, SBOM generation, image signing, dependency checking, and CI/CD pipeline defense.",
      regex:
        ~r/devsecops|supply chain|sbom|sigstore|cosign|trivy|dependency-check|secret detection|secret scan|git-secret|ci\/cd|pipeline security/i
    },
    %{
      id: "identity-access",
      label: "Identity, Access & Zero Trust",
      short_label: "Identity & Access",
      icon: "🔑",
      description:
        "IAM governance, authentication, secrets management, credential scanning, OAuth, PAM, and Zero Trust.",
      regex:
        ~r/identity|iam|secret|credential|password|oauth|jwt|auth|privilege escalation|pam|saml|ldap|active directory|kerberos|zero trust/i
    },
    %{
      id: "vuln-cve",
      label: "Vulnerability & CVE Intelligence",
      short_label: "Vuln & CVE",
      icon: "🔍",
      description:
        "Automated vulnerability scanners, CVE advisories, exploit PoCs, and patch management intelligence.",
      regex:
        ~r/vulnerability scanner|vulnerability management|vulnerability analysis|\bcve\b|cve-|cve_|patch management|nessus|nuclei/i
    },
    %{
      id: "pentest-redteam",
      label: "Penetration Testing & Exploits",
      short_label: "Pentest & Red Team",
      icon: "⚔️",
      description:
        "Exploitation frameworks, Command & Control (C2), payload generators, fuzzers, and offensive simulation tools.",
      regex:
        ~r/penetration testing|exploitation|exploit|c2|command & control|payload|fuzzing|red team|post exploitation|reverse shell|metasploit|shellcode/i
    },
    %{
      id: "network-perimeter",
      label: "Network & Perimeter Defense",
      short_label: "Network & Firewall",
      icon: "📡",
      description:
        "Firewalls, pfSense utilities, intrusion detection (IDS/IPS), packet analysis, Wi-Fi, and IoT/firmware defense.",
      regex:
        ~r/pfsense|firewall|snort|suricata|intrusion detection|ids|ips|packet|sniff|nmap|wireshark|network security|pcap|router|wireless|wifi|iot|firmware/i
    },
    %{
      id: "threat-intel-osint",
      label: "Threat Intelligence & OSINT",
      short_label: "Threat Intel & OSINT",
      icon: "👁️",
      description:
        "Open-source intelligence (OSINT), threat intelligence feeds, reconnaissance, and attack surface mapping.",
      regex:
        ~r/osint|threat intelligence|reconnaissance|recon|whois|shodan|subdomain|dorking|footprint|attack surface/i
    },
    %{
      id: "forensics-ir",
      label: "Incident Response & Forensics",
      short_label: "IR & Forensics",
      icon: "🚨",
      description:
        "Digital forensics, memory analysis, SIEM, SOC operations, timeline investigation, and incident triage.",
      regex:
        ~r/digital forensics|memory forensics|disk forensics|incident response|dfir|siem|soc|edr|volatility|autopsy|timeline analysis/i
    },
    %{
      id: "malware-reverse",
      label: "Malware Analysis & Reverse Eng",
      short_label: "Malware & Reverse",
      icon: "🔬",
      description:
        "Binary reverse engineering, decompilers, disassemblers, Ghidra, YARA rules, and dynamic sandbox analysis.",
      regex:
        ~r/reverse engineering|malware analysis|malware|decompiler|disassembler|ghidra|radare|yara|dynamic analysis sandboxing|binary analysis/i
    },
    %{
      id: "crypto-privacy",
      label: "Cryptography & Data Defense",
      short_label: "Cryptography",
      icon: "🔐",
      description:
        "Encryption utilities, cryptographic primitives, SSL/TLS auditing, PKI, hash analysis, and data defense.",
      regex:
        ~r/cryptography|encryption|cipher|hash analysis|hashcat|tls|ssl|pki|certificate|data recovery|exfiltration/i
    }
  ]

  def curated_categories, do: @curated_categories

  def category_counts do
    all_tools = tools()

    for cat <- @curated_categories, into: %{} do
      count =
        Enum.count(all_tools, fn tool ->
          haystack = "#{tool["tag"] || ""} #{tool["description"] || ""} #{tool["title"] || ""}"
          Regex.run(cat.regex, haystack) != nil
        end)

      {cat.id, count}
    end
  end

  def subcategories do
    tools()
    |> Enum.map(& &1["tag"])
    |> Enum.reject(&(&1 == "Cybersecurity Tools" or is_nil(&1) or String.contains?(&1, ",")))
    |> Enum.frequencies()
    |> Enum.sort_by(fn {_tag, count} -> count end, :desc)
    |> Enum.take(25)
  end

  def search_tools(query, category, sort, page) do
    query = String.downcase(query)

    filtered =
      tools()
      |> Enum.filter(fn tool ->
        category_matches?(tool, category) and
          Enum.any?([tool["title"], tool["description"], tool["tag"]], fn value ->
            String.contains?(String.downcase(value || ""), query)
          end)
      end)
      |> sort_tools(sort)

    total = length(filtered)
    page_count = max(div(total + @page_size - 1, @page_size), 1)
    page = min(max(page, 1), page_count)

    %{
      tools: Enum.slice(filtered, (page - 1) * @page_size, @page_size),
      categories: @curated_categories,
      category_counts: category_counts(),
      subcategories: subcategories(),
      total: total,
      page: page,
      page_count: page_count,
      page_size: @page_size
    }
  end

  def lab(id) do
    case Enum.find(labs(), &(&1["id"] == id)) do
      nil -> :error
      entry -> load_markdown(entry, "path", "labs")
    end
  end

  def blog_post(id) do
    case Enum.find(blog_posts(), &(&1["id"] == id)) do
      nil -> :error
      entry -> load_markdown(entry, "file", "blog")
    end
  end

  @impl true
  def handle_call(:tools, _from, state), do: {:reply, state.tools, state}
  def handle_call(:blogs, _from, state), do: {:reply, state.blogs, state}
  def handle_call(:labs, _from, state), do: {:reply, state.labs, state}

  defp read_json!(filename) do
    filename
    |> data_path()
    |> File.read!()
    |> Jason.decode!()
  end

  defp data_path(filename) do
    Application.app_dir(:cloud_security_corner, Path.join("priv/data", filename))
  end

  defp load_markdown(entry, key, directory) do
    filename = entry[key] |> Path.basename()

    path =
      Application.app_dir(:cloud_security_corner, Path.join(["priv/static", directory, filename]))

    with {:ok, markdown} <- File.read(path) do
      html =
        case Earmark.as_html(markdown, escape: false) do
          {:ok, html, _messages} ->
            html

          {:error, html, _errors} when is_binary(html) and byte_size(html) > 0 ->
            html

          other ->
            raise "Unable to render #{directory}/#{filename}: #{inspect(other)}"
        end

      {:ok, entry, html}
    else
      {:error, reason} ->
        raise "Unable to read #{directory}/#{filename}: #{inspect(reason)}"
    end
  end

  defp category_matches?(_entry, ""), do: true
  defp category_matches?(_entry, "all"), do: true

  defp category_matches?(entry, category) do
    if entry["category"] == category or entry["tag"] == category do
      true
    else
      cat_lower = String.downcase(category)
      haystack = "#{entry["tag"] || ""} #{entry["description"] || ""} #{entry["title"] || ""}"

      case Enum.find(@curated_categories, fn c ->
             c.id == cat_lower or String.downcase(c.label) == cat_lower or
               String.downcase(c.short_label) == cat_lower
           end) do
        %{regex: regex} ->
          Regex.run(regex, haystack) != nil

        nil ->
          tag_lower = String.downcase(entry["tag"] || "")
          category_lower = String.downcase(entry["category"] || "")

          tag_lower == cat_lower or category_lower == cat_lower or
            String.contains?(tag_lower, cat_lower) or
            String.contains?(category_lower, cat_lower)
      end
    end
  end

  defp sort_tools(tools, "az"), do: Enum.sort_by(tools, &String.downcase(&1["title"] || ""))

  defp sort_tools(tools, "za"),
    do: Enum.sort_by(tools, &String.downcase(&1["title"] || ""), :desc)

  defp sort_tools(tools, _sort), do: tools
end
