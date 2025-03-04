const memberProfilePut = async (params) => {
    console.log("memberProfilePut", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/member/profile', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
                                },
                                body: JSON.stringify(params)
                            })
    let jsonResult = response.json()
    console.log('memberProfilePut jsonResult', jsonResult)
    return jsonResult
}

const memberSignInPost = async (params) => {
    console.log("memberSignInPost", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/member/signin', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
                                },
                                body: JSON.stringify(params)
                            })
    let jsonResult = response.json()
    console.log('memberSignInPost jsonResult', jsonResult)
    return jsonResult
}

export {memberSignInPost, memberProfilePut}