import React, { useContext, useEffect, useState } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import chatComponent from "../pages/Chat";
import MessageForm from "../components/MessageForm";
// import swal from 'sweetalert';
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";


function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);
    const [toggleChat, settoggleChat] = useState(false);
    const [toggleBack, settoggleBack] = useState(false);
    function joinRoom(room, isPublic = true) {
        settoggleChat(true);
        // var kodrz_Key = "code";
        if (!user) {
            return alert("Please Login or Signup...!");
        }

        // console.log(rooms);

        // else if (room === "KODRZ") {
        //     // setCurrentRoom(rooms[1]); 
        //     swal("Please Enter a Secret Key:", {
        //         content: "input",
        //     }).then((value) => {
        //         if (value === kodrz_Key) { 
        //             setkodrz(true);
        //             console.log("KODRZ True");
        //         }
        //         else {
        //             swal(`Your Key is Incorrect!`);
        //             setkodrz(false);
        //             console.log("KODRZ False");
        //         }
        //     });
        //     if (kodrz === true) {
        //         setCurrentRoom(rooms[0]);
        //     }
        // }
        // else {
        // }
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);
        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        dispatch(resetNotifications(room));

    }
    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });


    const useMediaQuery = (query) => {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            window.addEventListener("resize", listener);
            return () => window.removeEventListener("resize", listener);
        }, [matches, query]);

        return matches;
    }

    const isPhone = useMediaQuery('(max-width: 768px)');


    useEffect(() => {
        if (user) {
            setCurrentRoom("KODRZ");
            getRooms();
            socket.emit("join-room", "KODRZ");
            socket.emit("new-user");
        }
    }, []);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("https://cuarta.herokuapp.com/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    function handlePrivateMemberMsg(member) {
        settoggleChat(true)

        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        // if (roomId === "KODRZ") {
        // console.log("You Select Kodrz");
        // }
        // else {
        joinRoom(roomId, false);
        // }
    }

    const [memberbtn, setmember] = useState(true);
    const [groupbtn, setGroup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isTogle, setIsTogle] = useState(false);

    const groupbtnclick = () => {
        setmember(false);
        setGroup(true);
        setSearchTerm("");
    }
    const memberbtnclick = () => {
        setmember(true);
        setGroup(false)
        setSearchTerm("");
    }


    if (!user) {
        return <></>;
    }

    const handleClick = () => {
        // 👇️ toggle
        setIsTogle(current => !current);

        // 👇️ or set to true
        // setIsActive(true);
    }
    const handleBackBtn = () => {
        settoggleChat(false)
    }
    if (isPhone) {
        return (
            <>
                <div className="container-main container">
                    <Row>
                        {toggleChat == false ? <Col md={4} className="sidebar" >
                            <div className="row ">
                                <div className="col-12 main-sidebar-parent px-0">
                                    <div className="main">
                                        <div className="side-nav">
                                            <div className="profile">
                                                <img src={user.picture} alt="profile-pic" />
                                            </div>
                                            <div className="icos">
                                                <div className="icon-container single_chat mt-4 px-4">
                                                    <button onClick={memberbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-user"></i></button>
                                                </div>
                                                <div className="icon-container group_chat">
                                                    <button onClick={groupbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-users"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items" >
                                        <div className="sections">
                                            {groupbtn === true ?

                                                <div className="groups mt-3" id="groups">
                                                    <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Groups</h2>
                                                    <div className="search-bar d-flex">

                                                        <div className="container-form m-3 position-relative  d-flex align-items-center">
                                                            <input type="text" autoComplete="off" id="box" placeholder="Search Groups..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
                                                            <i className="fas fa-search search__icon me-2 text-white position-absolute"></i>
                                                        </div>
                                                    </div>
                                                    {rooms.filter((room) => {
                                                        if (searchTerm === "") {
                                                            return room
                                                        }
                                                        else if (room.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                            return room
                                                        }
                                                        return null
                                                    }).map((room, idx) => (
                                                        <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room === currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                                                            {room} {currentRoom !== room && <span className="badge rounded-pill bg-danger">{user.newMessages[room]}</span>}
                                                        </ListGroup.Item>
                                                    ))}
                                                    {/* </ListGroup> */}
                                                </div> : ""
                                            }
                                            {memberbtn === true ? <div className="members mt-3" id="membr">
                                                <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Peoples</h2>
                                                <div className="search-bar d-flex">
                                                    {/* <input type="text" onChange={e => {setSearchTerm(e.target.value)}} className="form-control w-100 rounded-0 my-3 border-0 shadow-none" placeholder="Search Users..." />
                                        <i className="fas fa-search bg-white my-3 d-flex pe-2 align-items-center"></i> */}


                                                    <div className="container-form search-inp m-3 position-relative d-flex align-items-center">
                                                        <input type="text" autoComplete="off" id="box" placeholder="Search Users..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
                                                        <i className="fas fa-search search__icon me-2 text-white position-absolute" ></i>
                                                    </div>
                                                    {/* <button className="btn btn-dark my-3 bg-dark border-0"> */}
                                                    {/* </button> */}
                                                </div>
                                                {members.filter((member) => {
                                                    if (searchTerm === "") {
                                                        return member
                                                    }
                                                    else if (member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                        return member

                                                    }
                                                    return null
                                                }).map((member) => (
                                                    <ListGroup.Item key={member.id} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ display: `${member._id === user._id ? "none" : "block"}`, cursor: "pointer", userSelect: "none" }}>
                                                        <Row className="d-flex align-items-center">
                                                            <Col xs={3} className="member-status">
                                                                <img src={member.picture} alt="Profile Pic" className="member-status-img" />
                                                                {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                                                            </Col>
                                                            <Col xs={8}>
                                                                {member.name}
                                                                {member._id === user?._id && " (You)"}
                                                                {member.status === "offline" && " (Offline)"}
                                                            </Col>
                                                            <Col xs={1} className="p-0">
                                                                <span className="badge rounded-pill bg-danger">{user.newMessages[orderIds(member._id, user._id)]}</span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </div> : ""
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col> : null}
                        {toggleChat == true ? <Col md={8} className="chat-box ps-0" >
                            <MessageForm />
                        </Col> : null}
                        {toggleChat == true ? <div className="back-btn">
                            <div className="back-ico" onClick={handleBackBtn}>
                                <i class="fa-solid fa-left-long"></i>
                            </div>
                        </div> : null}
                    </Row>
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <div className="container-main container">
                    <Row>
                        <Col md={4} className="sidebar" >
                            <div className="row ">
                                <div className="col-12 main-sidebar-parent px-0">
                                    <div className="main">
                                        <div className="side-nav">
                                            <div className="profile">
                                                <img src={user.picture} alt="profile-pic" />
                                            </div>
                                            <div className="icos">
                                                <div className="icon-container single_chat mt-4 px-4">
                                                    <button onClick={memberbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-user"></i></button>
                                                </div>
                                                <div className="icon-container group_chat">
                                                    <button onClick={groupbtnclick} style={{ width: "100%", background: "transparent" }} className="border-0"><i className="text-white fa-solid fa-users"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="items" >
                                        <div className="sections">
                                            {groupbtn === true ?

                                                <div className="groups mt-3" id="groups">
                                                    <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Groups</h2>
                                                    <div className="search-bar d-flex">

                                                        <div className="container-form m-3 position-relative  d-flex align-items-center">
                                                            <input type="text" autoComplete="off" id="box" placeholder="Search Groups..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
                                                            <i className="fas fa-search search__icon me-2 text-white position-absolute"></i>
                                                        </div>
                                                    </div>
                                                    {rooms.filter((room) => {
                                                        if (searchTerm === "") {
                                                            return room
                                                        }
                                                        else if (room.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                            return room
                                                        }
                                                        return null
                                                    }).map((room, idx) => (
                                                        <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room === currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                                                            {room} {currentRoom !== room && <span className="badge rounded-pill bg-danger">{user.newMessages[room]}</span>}
                                                        </ListGroup.Item>
                                                    ))}
                                                    {/* </ListGroup> */}
                                                </div> : ""
                                            }
                                            {memberbtn === true ? <div className="members mt-3" id="membr">
                                                <h2 className="text-white text-center fw-bold ff-cod"><span className="text-danger opacity-75">#</span>Peoples</h2>
                                                <div className="search-bar d-flex">
                                                    {/* <input type="text" onChange={e => {setSearchTerm(e.target.value)}} className="form-control w-100 rounded-0 my-3 border-0 shadow-none" placeholder="Search Users..." />
                                        <i className="fas fa-search bg-white my-3 d-flex pe-2 align-items-center"></i> */}


                                                    <div className="container-form search-inp m-3 position-relative d-flex align-items-center">
                                                        <input type="text" autoComplete="off" id="box" placeholder="Search Users..." onChange={e => { setSearchTerm(e.target.value) }} className="search__box" />
                                                        <i className="fas fa-search search__icon me-2 text-white position-absolute" ></i>
                                                    </div>
                                                    {/* <button className="btn btn-dark my-3 bg-dark border-0"> */}
                                                    {/* </button> */}
                                                </div>
                                                {members.filter((member) => {
                                                    if (searchTerm === "") {
                                                        return member
                                                    }
                                                    else if (member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                                        return member

                                                    }
                                                    return null
                                                }).map((member) => (
                                                    <ListGroup.Item key={member.id} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} style={{ display: `${member._id === user._id ? "none" : "block"}`, cursor: "pointer", userSelect: "none" }}>
                                                        <Row className="d-flex align-items-center">
                                                            <Col xs={3} className="member-status">
                                                                <img src={member.picture} alt="Profile Pic" className="member-status-img" />
                                                                {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                                                            </Col>
                                                            <Col xs={8}>
                                                                {member.name}
                                                                {member._id === user?._id && " (You)"}
                                                                {member.status === "offline" && " (Offline)"}
                                                            </Col>
                                                            <Col xs={1} className="p-0">
                                                                <span className="badge rounded-pill bg-danger">{user.newMessages[orderIds(member._id, user._id)]}</span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </div> : ""
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={8} className="chat-box ps-0" >
                            <MessageForm />
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Sidebar;
