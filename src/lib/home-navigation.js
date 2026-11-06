export function toolsSearchPath(query) {
  const value = query.trim();
  return value ? `/tools?q=${encodeURIComponent(value)}` : '/tools';
}

export function selectedHomeProvider(providers, requested) {
  return providers.find(provider => provider.id === requested) || providers[0];
}
