import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import './Profile.css'

export default function Profile() {

    const { socket } = useContext(AppContext);
    const user = useSelector((state) => state.user);
    socket.emit("message-room", user);

    // const handelRemove = () => {
    //     socket.emit("remove-user");
    // }

    if (user) {
        return (
            <div className="main-container">

                <div className='user container'>
                    <div class="main-profile">
                        <img src={user.picture} alt="" class="photo" />
                        <span class="name">{user.name}</span>
                        <span class="details">Hey, there i`m using DarkApp</span>
                        <div class="buttons">
                            <div class="button follow fs-6">
                                <i class="fa-solid fa-angle-down me-2"></i>
                                Download
                            </div>
                            <button class="button message border-0">
                                <i class="fa-solid fa-trash me-2 fs-6"></i>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="main-container">
                <div className='not container'>
                    Please Login...!
                </div>
            </div>
        )
    }
}