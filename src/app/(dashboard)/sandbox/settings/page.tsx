"use client";

import { Save, Shield, Globe, HardDrive, Key, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function SandboxSettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <PageWrapper
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-fg">Sandbox Environment Settings</h1>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded bg-success-soft border border-success/20 text-xs font-bold text-success hover:bg-success-soft/80 shadow-md transition-all">
            <Save className="h-4 w-4" /> Save Configuration
          </button>
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
        
        {/* Settings Navigation */}
        <div className="w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab("integrations")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "integrations" ? "bg-fg/8 text-fg" : "text-muted hover:bg-fg/3 hover:text-fg"
            )}
          >
             <Key className="h-4 w-4" /> Integrations API
          </button>
          <button 
            onClick={() => setActiveTab("hypervisor")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "hypervisor" ? "bg-fg/8 text-fg" : "text-muted hover:bg-fg/3 hover:text-fg"
            )}
          >
             <HardDrive className="h-4 w-4" /> Hypervisor Specs
          </button>
          <button 
            onClick={() => setActiveTab("network")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "network" ? "bg-fg/8 text-fg" : "text-muted hover:bg-fg/3 hover:text-fg"
            )}
          >
             <Globe className="h-4 w-4" /> Network Egress
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeTab === "security" ? "bg-fg/8 text-fg" : "text-muted hover:bg-fg/3 hover:text-fg"
            )}
          >
             <Shield className="h-4 w-4" /> Security & Retenion
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 max-w-3xl space-y-6">
          
          {activeTab === "integrations" && (
            <>
              <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-fg/2">
                  <h3 className="text-sm font-bold text-fg">VirusTotal Integration</h3>
                  <p className="text-xs text-muted mt-1">Configure VT Enterprise API key for hash enrichment.</p>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-medium text-muted">API Key</label>
                     <div className="flex items-center gap-3">
                       <input type="password" value="********************************" readOnly className="flex-1 h-9 bg-bg border border-border rounded-md px-3 text-sm text-muted focus:outline-none" />
                       <button className="px-4 py-2 bg-fg/5 hover:bg-fg/10 border border-border rounded-md text-xs font-bold text-secondary transition-colors">Rotate Key</button>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 pt-2">
                     <button className="flex items-center gap-1.5 text-[11px] font-bold text-success hover:text-success/80 transition-colors">
                       <RefreshCw className="h-3 w-3" /> Test Connection
                     </button>
                     <span className="text-[10px] text-dimmed">Last successful ping: 2 mins ago</span>
                   </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-fg/2">
                  <h3 className="text-sm font-bold text-fg">GreyNoise Integration</h3>
                  <p className="text-xs text-muted mt-1">Configure GreyNoise context API for IP enrichment.</p>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-medium text-muted">Enterprise API Key</label>
                     <input type="password" placeholder="Enter GreyNoise Key..." className="w-full h-9 bg-bg border border-border rounded-md px-3 text-sm text-fg focus:outline-none focus:border-accent transition-colors placeholder:text-dimmed" />
                   </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "hypervisor" && (
            <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-fg/2">
                <h3 className="text-sm font-bold text-fg">Default Sandbox Profiles</h3>
                <p className="text-xs text-muted mt-1">Select the default machine snapshots used when an OS is not explicitly requested.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted uppercase tracking-wider">Windows Default</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-accent bg-accent-soft rounded-xl p-4 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-accent shadow-glow" />
                      <h4 className="font-bold text-sm text-fg">Win10_22H2_Office</h4>
                      <p className="text-[11px] text-muted mt-1">Windows 10, Office 2019, Acrobat Reader, Chrome 114</p>
                    </div>
                    <div className="border border-border bg-bg/50 hover:bg-fg/3 rounded-xl p-4 cursor-pointer transition-colors">
                      <h4 className="font-bold text-sm text-secondary">Win11_Dev_Base</h4>
                      <p className="text-[11px] text-muted mt-1">Windows 11 23H2, Developer Tools, Firefox</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted uppercase tracking-wider">Linux Default</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border bg-bg/50 hover:bg-fg/3 rounded-xl p-4 cursor-pointer transition-colors">
                      <h4 className="font-bold text-sm text-secondary">Ubuntu_22.04_LTS</h4>
                      <p className="text-[11px] text-muted mt-1">Standard Server build, no GUI, curl, wget, python3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "network" && (
            <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-fg/2">
                <h3 className="text-sm font-bold text-fg">Egress Routing</h3>
                <p className="text-xs text-muted mt-1">Configure how sandbox traffic exits the internal network.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg/50">
                    <div>
                      <h4 className="font-bold text-sm text-fg">Tor Anonymity Network</h4>
                      <p className="text-xs text-muted mt-1">Route all sandbox egress through Tor. High latency, high anonymity.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-success-soft border border-success/30 flex items-center px-0.5 cursor-pointer">
                       <div className="w-4 h-4 rounded-full bg-success transform translate-x-4 shadow-md" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg/50">
                    <div>
                      <h4 className="font-bold text-sm text-fg">Strict DNS Logging</h4>
                      <p className="text-xs text-muted mt-1">Force all DNS requests through internal sinkhole for PCAP extraction.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-success-soft border border-success/30 flex items-center px-0.5 cursor-pointer">
                       <div className="w-4 h-4 rounded-full bg-success transform translate-x-4 shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
