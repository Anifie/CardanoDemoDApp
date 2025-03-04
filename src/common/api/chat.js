const memberChannelListingPost = async (params) => {
    console.log("channelListingPost", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/chat/channel/member/listing', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
                                },
                                body: JSON.stringify(params)
                            })
    let jsonResult = response.json()
    console.log('memberChannelListingPost jsonResult', jsonResult)
    return jsonResult
}

const channelMessageListingPost = async (params) => {
    console.log("channelMessageListingPost", params)
    let response = await fetch(process.env.BACKEND_API_URL + '/chat/channel/message/listing', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem("backend_access_token")
                                },
                                body: JSON.stringify(params)
                            })
    let jsonResult = response.json()
    console.log('channelMessageListingPost jsonResult', jsonResult)
    return jsonResult
}

export {memberChannelListingPost, channelMessageListingPost}