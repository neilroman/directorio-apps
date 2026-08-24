"use client";

import { useEffect, useRef } from "react";

export default function ChatangoWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || document.getElementById("cid0020000448589094127")) return;

    const script = document.createElement("script");
    script.id = "cid0020000448589094127";
    script.setAttribute("data-cfasync", "false");
    script.async = true;
    script.src = "//st.chatango.com/js/gz/emb.js";
    script.style.cssText = "width:250px;height:500px;";
    script.text = '{"handle":"appsdeandroid","arch":"js","styles":{"a":"000066","b":46,"c":"FFFFFF","d":"FFFFFF","f":46,"i":46,"k":"000066","l":"000066","m":"000066","n":"FFFFFF","o":46,"p":"10","q":"000066","r":46,"cnrs":"0.35","fwtickm":1}}';

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: 250, height: 500 }}
    />
  );
}
