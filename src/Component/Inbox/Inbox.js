/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from 'antd';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import attachment from '../../images/attachment.png';
import user1 from '../../images/user1.png';

// this socket connection...
const socket = io.connect("http://localhost:5000");

export default function Inbox({setsessionToken}) {

    const decoded = jwt_decode(sessionStorage.getItem("token"));

    useEffect(() => {
        setsessionToken(decoded?.username);
    },[])

    //state
    const [allUser,setAllUser] = useState([]);
    const [userActive,setUserActive] = useState({});
    const [currentMessage, setCurrentMessage] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [room,setRoom] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [signInUser,setSignInUser] = useState(decoded?.username);

    // modal
    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
    
    // here get all the user list
    useEffect(() => {
        axios.get(`http://localhost:5000/signup/getAllUser/${signInUser}`)
        .then(res => {
            // console.log(res.data);
            setAllUser(res.data);
        })
        .catch(err => console.log(err.message))
    },[])

    // here see which conversion is click
    const handleActive = (item) => {
        // console.log(item);
        setUserActive(item);

        axios.get(`http://localhost:5000/message/getMessage?author=${signInUser}&receiver=${item.name}`)
          .then(res => setMessageList(res.data))
          .catch(err => console.log(err.message))
    }

    const sendMessage = async () => {
        
        // setCurrentMessage("");
        
        if (currentMessage !== "") {

          const messageData = {
            author: signInUser,
            receiver: userActive?.name,
            message: currentMessage,
            room: room,
            time: new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
          };
    
          await socket.emit("send_message", messageData);

          axios.post("http://localhost:5000/message",messageData)
          .then(res => console.log(res.data))
          .catch(err => console.log(err.message))
          
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
        }
      };

      // get recieve message using socket
      useEffect(() => {
        socket.on("receive_message", (data) => {
          console.log(data);
          setMessageList((list) => [...list, data]);
        });
      }, [socket]);

      // join the room for chat..
      const joinRoom = () => {
        if (userActive.name !== "" && room !== "") {
            socket.emit("join_room", room);
            handleCancel();
        }
      };


    return (
        <>
            <div id="chat-container">
                <div id="search-container">
                    <input type="text" placeholder="Search" />
                </div>
                <div id="conversation-list">
                    {
                        allUser.map((item,index) => 
                            item.name === userActive?.name ?
                            <div key={index} onClick={() => handleActive(item)} className="conversation active">
                                <img src={user1} alt="" />
                                <div className="title-text">{item.name}</div>
                                <div className="created-date">
                                    {new Date(item.createdAt).toLocaleString('default', { month: 'short' })}
                                    {
                                        new Date(item.createdAt).getDate()
                                    } 
                                </div>
                                <div className="conversation-message">This is a message</div>
                            </div>
                            :
                            <div key={index} onClick={() => handleActive(item)} className="conversation">
                                <img src={user1} alt="" />
                                <div className="title-text">{item.name}</div>
                                <div className="created-date">
                                    {new Date(item.createdAt).toLocaleString('default', { month: 'short' })}
                                    {
                                        new Date(item.createdAt).getDate()
                                    } 
                                </div>
                                <div className="conversation-message">This is a message</div>
                            </div>
                            
                        )
                    }
                </div>
                {/* conversation-list end here */}

                {/* <div id="new-message-container">
                    <a href="#">+</a>
                </div> */}
                {
                    userActive?.name && 
                    <>
                        <div id="chat-title">
                            <span>{userActive.name}</span>
                            
                            {/* for modal */}
                            <div className="">
                                <Button type="primary" onClick={showModal}>
                                    Add for chat
                                </Button>
                                <Modal className="" title="Join Room" visible={isModalVisible}
                                centered
                                footer={null} 
                                onCancel={handleCancel}>
                                <input
                                    style={{width:"300px",height:"40px"}}
                                    className="form-control fs-5"
                                    placeholder="Enter a Room ID"
                                    onChange={(event) => {
                                    setRoom(event.target.value);
                                    }}
                                />
                                <br />
                                <Button type="primary" onClick={joinRoom}>Join A Room</Button>
                                </Modal>
                            </div>
                        </div>

                        

                        <div id="chat-message-list">
                            {
                                messageList.slice(0).reverse().map((item,index) => (
                                    item.author === signInUser?
                                    <div key={index} className="message-row you-message">
                                        <div className="message-content">
                                            <div className="message-text">
                                                {item.message}
                                            </div>
                                            <div className="message-time">
                                                {item.time}
                                            </div>
                                            <div className="message-time">
                                                {item.author}
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div key={index} className="message-row other-message">
                                        <div className="message-content">
                                            <img src={user1} alt="" />
                                            <div className="message-text">
                                                {item.message}
                                            </div>
                                            <div className="message-time">
                                                {item.time}
                                            </div>
                                            <div className="message-time">
                                                {item.author}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div id="chat-form">
                            <img src={attachment} alt="Add Attachment"/>
                            <input className="text-white form-control"           
                            onKeyPress={(event) => {
                                 event.key === "Enter" && sendMessage()
                                }} 

                                onChange={(event) => {
                                 setCurrentMessage(event.target.value)
                                }}
                                value={currentMessage} 

                                type="text" placeholder="Type a message" />
                        </div>
                    </>
                }
            </div>
        </>
    );
}
