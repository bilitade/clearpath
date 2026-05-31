export function ThemeInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme')||'system',r=s==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light':s;d.classList.remove('light','dark');if(r==='dark')d.classList.add('dark');d.style.colorScheme=r}catch(e){}})();`,
      }}
    />
  );
}
