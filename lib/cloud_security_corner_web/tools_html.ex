defmodule CloudSecurityCornerWeb.ToolsHTML do
  use CloudSecurityCornerWeb, :html

  embed_templates("tools_html/*")

  def page_url(query, category, sort, page) do
    params =
      %{}
      |> maybe_put("q", query)
      |> maybe_put("category", category)
      |> maybe_put("sort", if(sort == "default" or sort == "az", do: nil, else: sort))
      |> Map.put("page", Integer.to_string(page))

    "/tools?" <> URI.encode_query(params)
  end

  def category_url(cat_id, query, sort) do
    params =
      %{}
      |> maybe_put("q", query)
      |> maybe_put("category", if(cat_id == "all", do: nil, else: cat_id))
      |> maybe_put("sort", if(sort == "default" or sort == "az", do: nil, else: sort))

    if map_size(params) == 0 do
      "/tools"
    else
      "/tools?" <> URI.encode_query(params)
    end
  end

  def display_badge(tool) do
    tag = (tool["tag"] || "") |> String.trim()
    title = (tool["title"] || "") |> String.trim()
    desc = (tool["description"] || "") |> String.trim()
    combined = String.downcase("#{tag} #{title} #{desc}")

    cond do
      tag != "" and tag != "Cybersecurity Tools" and not String.contains?(tag, ",") ->
        tag

      String.match?(
        combined,
        ~r/\bagentic\b|\bagent\b|\bmcp\b|\bllm\b|\bllms\b|guardrail|\bopenai\b|\bai security\b/i
      ) ->
        "Agentic & AI"

      String.match?(title, ~r/cve-\d{4}-\d+|cve_\d{4}_\d+|\bcve\b/i) ->
        "CVE Advisory & PoC"

      String.match?(
        combined,
        ~r/kubernetes|docker|container|k8s|cloud security|aws|azure|gcp|cspm|ciem/i
      ) ->
        "Cloud & Container"

      String.match?(combined, ~r/identity|iam|secret|credential|password|oauth|jwt|auth|pam/i) ->
        "Identity & Access"

      String.match?(
        combined,
        ~r/web security|api security|waf|dast|sast|xss|sql injection|csrf|owasp/i
      ) ->
        "Application Security"

      String.match?(combined, ~r/penetration testing|exploitation|c2|payload|fuzzing|red team/i) ->
        "Exploits & Red Team"

      String.match?(
        combined,
        ~r/pfsense|firewall|snort|suricata|intrusion detection|ids|ips|packet|sniff|nmap|wireshark/i
      ) ->
        "Network & Firewall"

      String.match?(combined, ~r/osint|threat intelligence|reconnaissance|recon|whois|shodan/i) ->
        "Threat Intel & OSINT"

      String.match?(
        combined,
        ~r/reverse engineering|malware|decompiler|disassembler|ghidra|radare|yara/i
      ) ->
        "Malware & Reverse"

      String.match?(combined, ~r/digital forensics|memory forensics|incident response|dfir|siem/i) ->
        "IR & Forensics"

      String.match?(combined, ~r/cryptography|encryption|cipher|hashcat|tls|ssl/i) ->
        "Cryptography"

      String.contains?(tag, ",") ->
        tag |> String.split(",") |> List.first() |> String.trim()

      true ->
        "Security Tool"
    end
  end

  defp maybe_put(map, _key, nil), do: map
  defp maybe_put(map, _key, ""), do: map
  defp maybe_put(map, key, val), do: Map.put(map, key, val)
end
