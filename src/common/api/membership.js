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

const memberMintNFTPost = async (params) => {
    console.log("memberMintNFTPost", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/nft/queue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
        },
        body: JSON.stringify(params)
    })
    let jsonResult = response.json()
    console.log('memberMintNFTPost jsonResult', jsonResult)
    return jsonResult
}

const memberNFTCheckQueue = async (params) => {
    console.log("memberNFTCheckQueue", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/nft/queue/listing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
        },
        body: JSON.stringify(params)
    })
    let jsonResult = response.json()
    console.log('memberNFTCheckQueue jsonResult', jsonResult)
    return jsonResult
}

const getMemberNFTListing = async (params) => {
    const result = { code: 1, success: false, msg: "", data: [] };
    try {
        const resp = await fetch(
            process.env.BACKEND_API_URL + '/asset/listing',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
                },
                body: JSON.stringify(params)
            }
        );
        if (resp.data) {
            result.success = resp.data.Success;
            result.data = resp.data.Data?.assets;
            result.msg = resp.data.Message;
        }
    } catch (err) {
        console.error("Cannot get my wallet", err);
        result.msg = "Cannot get my wallet";
    }
    return result;
};

const discordJoin = async (params) => {
    let response = await fetch(process.env.BACKEND_API_URL + '/discord/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
        },
        body: JSON.stringify(params)
    })
    let jsonResult = await response.json()
    return jsonResult
}

export { memberSignInPost, memberProfilePut, memberMintNFTPost, memberNFTCheckQueue, getMemberNFTListing, discordJoin }