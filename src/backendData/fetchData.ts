
export async function fetchData( name: string){
    const q = encodeURIComponent(name??"");
    const url  = `https://imdb.iamidiotareyoutoo.com/search?q=${q}=&lsn=1&v=1`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Fetch failed:${res.status}`)
        const data = await res.json();
    return data;
}
export async function loadFile() {
  const res = await fetch("/2025_demo.uc");
  if (!res.ok) throw new Error("Soubor nenalezen");

  const text = await res.text();
  console.log("Fetched file content:", text);
  return text;
};
