import Script from "next/script";

export default function HydrationFix() {
  return (
    <Script
      id="hydration-fix"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html:
          `(function(){var a='fdprocessedid';function r(n){if(n&&n.nodeType===1&&n.hasAttribute&&n.hasAttribute(a)){n.removeAttribute(a)}}document.querySelectorAll('['+a+']').forEach(r);var m=new MutationObserver(function(s){for(var i=0;i<s.length;i++){var t=s[i];if(t.type==='attributes'&&t.attributeName===a){t.target.removeAttribute(a)}if(t.type==='childList'){t.addedNodes.forEach(function(n){r(n);if(n&&n.querySelectorAll){n.querySelectorAll('['+a+']').forEach(r)}})}}});m.observe(document.documentElement,{attributes:true,attributeFilter:[a],childList:true,subtree:true});})();`,
      }}
    />
  );
}
