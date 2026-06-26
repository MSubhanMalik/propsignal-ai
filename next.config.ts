import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@langchain/langgraph', '@langchain/anthropic'],
}

export default nextConfig
