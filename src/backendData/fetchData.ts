/*jednoduchy fetch dat z imdb s možnosti poslat request na dany název
 kde db vráti několik vysledků */
export async function fetchData( name: string){
    const q = encodeURIComponent(name??"");
    const url  = `https://imdb.iamidiotareyoutoo.com/search?q=${q}=&lsn=1&v=1`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Fetch failed:${res.status}`)
        const data = await res.json();
    return data;
}