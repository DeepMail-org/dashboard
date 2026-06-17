"use client";

import { Save, Shield, Globe, HardDrive, Key, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SandboxSettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-white overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1115] shrink-0">
        <h1 className="text-lg font-bold text-white">SOC Configuration</h1>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex items-start gap-8">
        
        {/* Settings Navigation */}
        <div className="w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab("integrations")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "integrations" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
             <Key className="h-4 w-4" /> Integrations API
          </button>
          <button 
            onClick={() => setActiveTab("hypervisor")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "hypervisor" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
             <HardDrive className="h-4 w-4" /> Hypervisor Specs
          </button>
          <button 
            onClick={() => setActiveTab("network")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "network" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
             <Globe className="h-4 w-4" /> Network Egress
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "security" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
             <Shield className="h-4 w-4" /> Security & Retenion
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-3xl space-y-6">
          
          {activeTab === "integrations" && (
            <>
              <div className="rounded-2xl border border-white/5 bg-[#0f1115] shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-bold text-white">VirusTotal Integration</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure VT Enterprise API key for hash enrichment.</p>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-medium text-gray-400">API Key</label>
                     <div className="flex items-center gap-3">
                       <input type="password" value="********************************" readOnly className="flex-1 h-9 bg-black/40 border border-white/10 rounded-md px-3 text-sm text-gray-400 focus:outline-none" />
                       <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-bold text-gray-300 transition-colors">Rotate Key</button>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 pt-2">
                     <button className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                       <RefreshCw className="h-3 w-3" /> Test Connection
                     </button>
                     <span className="text-[10px] text-gray-500">Last successful ping: 2 mins ago</span>
                   </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#0f1115] shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-sm font-bold text-white">GreyNoise Integration</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure GreyNoise context API for IP enrichment.</p>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-medium text-gray-400">Enterprise API Key</label>
                     <input type="password" placeholder="Enter GreyNoise Key..." className="w-full h-9 bg-black/40 border border-white/10 rounded-md px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-700" />
                   </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "hypervisor" && (
            <div className="rounded-2xl border border-white/5 bg-[#0f1115] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white">Default Sandbox Profiles</h3>
                <p className="text-xs text-gray-500 mt-1">Select the default machine snapshots used when an OS is not explicitly requested.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Windows Default</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-blue-500/50 bg-blue-500/5 rounded-xl p-4 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                      <h4 className="font-bold text-sm text-white">Win10_22H2_Office</h4>
                      <p className="text-[11px] text-gray-400 mt-1">Windows 10, Office 2019, Acrobat Reader, Chrome 114</p>
                    </div>
                    <div className="border border-white/10 bg-black/20 hover:bg-white/5 rounded-xl p-4 cursor-pointer transition-colors">
                      <h4 className="font-bold text-sm text-gray-300">Win11_Dev_Base</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Windows 11 23H2, Developer Tools, Firefox</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Linux Default</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/10 bg-black/20 hover:bg-white/5 rounded-xl p-4 cursor-pointer transition-colors">
                      <h4 className="font-bold text-sm text-gray-300">Ubuntu_22.04_LTS</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Standard Server build, no GUI, curl, wget, python3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "network" && (
            <div className="rounded-2xl border border-white/5 bg-[#0f1115] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white">Egress Routing</h3>
                <p className="text-xs text-gray-500 mt-1">Configure how sandbox traffic exits the internal network.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                    <div>
                      <h4 className="font-bold text-sm text-gray-200">Tor Anonymity Network</h4>
                      <p className="text-xs text-gray-500 mt-1">Route all sandbox egress through Tor. High latency, high anonymity.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center px-0.5 cursor-pointer">
                       <div className="w-4 h-4 rounded-full bg-emerald-400 transform translate-x-4 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                    <div>
                      <h4 className="font-bold text-sm text-gray-200">Strict DNS Logging</h4>
                      <p className="text-xs text-gray-500 mt-1">Force all DNS requests through internal sinkhole for PCAP extraction.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center px-0.5 cursor-pointer">
                       <div className="w-4 h-4 rounded-full bg-emerald-400 transform translate-x-4 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
