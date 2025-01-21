import { Link, useParams } from "react-router-dom";
import backend from '../backend.js';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Text } from '@chakra-ui/react'

export default function Follow() {

    const { userId } = useParams();

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const [displayName, setDisplayName] = useState(null)

    const navigate = useNavigate()

    async function fetchFollowersFollowing() {
        try {
            const response = await backend.get(`/user/${userId}/profile`);
            const data = response.data
            setDisplayName(data.display_name)

            const followersResponse = await backend.get(`/user/${userId}/followers`)
            const followingResponse = await backend.get(`/user/${userId}/followees`)

            setFollowers(followersResponse.data.followers)
            setFollowing(followingResponse.data.followees)

            console.log(followers)
        } catch (err) {
            console.error("Error fetching follow data: ", err)
        }
    } 

    useEffect(() => {
        fetchFollowersFollowing()
    }, [userId]);

    return (
        <div className={"flex w-full h-full items-center justify-center"}>
            <div className={"flex flex-col w-[800px] h-[100vh] px-5  py-2 am-auto overflow-y-auto border-l border-r border-gray-300"}>
                <p>{followers.length > 0 ? `${displayName} is Followed By...` : `${displayName} has no followers`}</p>
                {followers.map((value) => (
                    <Text fontSize="1rem" color="black.500" zIndex="3" as="button" textAlign="left" pl="8px" mt="2px" background="gray.200"
                    _hover={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => {navigate('/profile/' + value.id)}}>
                      {value.display_name}
                    </Text>
                ))}

                <p>{following.length > 0 ? `${displayName} is Following...` : `${displayName} does not follow anyone`}</p>
                {following.map((value) => (
                    <Text fontSize="1rem" color="black.500" zIndex="3" as="button" textAlign="left" pl="8px" mt="2px" background="gray.200"
                    _hover={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => {navigate('/profile/' + value.id)}}>
                      {value.display_name}
                    </Text>
                ))}
            </div>
        </div>
        );
}