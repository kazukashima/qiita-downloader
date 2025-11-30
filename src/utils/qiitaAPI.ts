export async function fetchQiitaArticles(userId: string, token: string){
  const url=`https://qiita.com/api/v2/users/${userId}/items`;

  const res=await fetch(url,{
    headers:{
      Authorization: `Bearer ${token}`,
    }
  })


  if(!res.ok){
    throw new Error(`Qiita API error: ${res.status}`);
  }

 const data =await res.json();
 return data;
}