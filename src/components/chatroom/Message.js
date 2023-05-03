import { useRef, useEffect } from "react";

const Message = ({ userInfo, memberData, msg }) => {
  console.log("message", memberData);
  console.log("message userInfo", userInfo);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div ref={ref}>
      <div
        className={
          memberData.userId === msg.senderId
            ? "chatRoom__mine"
            : "chatRoom__orther"
        }
      >
        <div
          className={
            msg.senderId === memberData.userId
              ? "chatRoom__mine__msg"
              : "chatRoom__orther__userImg"
          }
          style={
            msg.senderId === memberData.userId
              ? null
              : { backgroundImage: `url(${userInfo.userInfo.personImg})` }
          }
        >
          {msg.senderId === memberData.userId ? msg.text : null}
        </div>
        <div
          className={
            msg.senderId === memberData.userId
              ? "chatRoom__mine__userImg"
              : "chatRoom__orther__msg"
          }
          style={
            msg.senderId === memberData.userId
              ? { backgroundImage: `url(${memberData.personImg})` }
              : null
          }
        >
          {msg.senderId === memberData.userId ? null : msg.text}
        </div>
      </div>
    </div>
  );
};

export default Message;
