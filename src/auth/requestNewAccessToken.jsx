async function requestNewAccessToken(refreshToken){
    try{
      const response = await fetch('http://localhost:5000/api/refreshToken',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if(response.ok){
        const json = await response.json()
        if(json.error){
          throw new Error(json.error)
        }
        return json.body.accessToken;
      }else{
        throw new Error(response.statusText)
      }
    }catch(error){
      console.log(error)
      return
    }
  }

export default requestNewAccessToken;