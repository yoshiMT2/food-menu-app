import React, { createContext, useContext, useState, useMemo } from 'react';
import jwt_decode from 'jwt-decode';

const UserDetails = createContext();

export function useUserDetails() {
    const context = useContext(UserDetails);
    if (!context) {
        throw new Error('UserDetails must be provided');
    }
    return context
}

export function UserDetailsProvider(props) {
    const userDetailsFromStorage = localStorage.getItem('userDetails')
        ? JSON.parse(localStorage.getItem('userDetails')) : null;

    let accessTokenFromStrage = false;
    let refreshTokenFromStorage = false;
    let nameFromStorage = false;

    if (userDetailsFromStorage) {
        if (userDetailsFromStorage.accessToken) {
            accessTokenFromStrage = userDetailsFromStorage.access;
            const jwt_decoded = jwt_decode(accessTokenFromStrage);
            nameFromStorage = jwt_decoded.name;
        } else {
            accessTokenFromStrage = false;
            nameFromStorage = false;
        }
        refreshTokenFromStorage = userDetailsFromStorage.refresh
            ? userDetailsFromStorage.refresh : false;
    }

    const [userDetails, setUserDetails] = useState({
        accessToken: accessTokenFromStrage,
        refreshToken: refreshTokenFromStorage,
        name: nameFromStorage
    });

    const value = useMemo(() => {
        function updateUserDetail(accessToken, refreshToken) {
            const newUserDetails = { ...userDetails};

            newUserDetails.accessToken = accessToken;
            newUserDetails.refreshToken = refreshToken;

            if (newUserDetails.accessToken) {
                const jwt_decoded = jwt_decode(newUserDetails.accessToken);
                newUserDetails.name = jwt_decoded.name;
            } else {
                newUserDetails = false;
            }

            setUserDetails(newUserDetails);
        }
        return [{ ...userDetails}, updateUserDetail];
    }, [userDetails])

    return <UserDetails.Provider value={value} {...props} />;
}