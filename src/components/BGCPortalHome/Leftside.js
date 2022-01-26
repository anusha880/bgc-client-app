import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import './LeftSide.css';
import Avatar from "@material-ui/core/Avatar";
import MyNetworks from '../UserProfile/MyNetworks';
import MyCommunities from '../UserProfile/MyCommunities';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Typography from '@mui/material/Typography';


const Leftside = ({ user: {userInfo} }) => {
    const { firstName, lastName, imageUrl, headLine } = userInfo;
    let defaultImgUrl = "https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/no-img.png?alt=media";
   
    return (
        <div className="Container">
            <div className="userCardArt">
            <Avatar
                alt="Remy Sharp"
                className="portal__header__image"
                src={ imageUrl ? imageUrl: defaultImgUrl }
              />
              <label className="user__label">{firstName} {lastName} </label>
              { headLine && <p className="user__role">{headLine}</p> }
            </div>
            <MyNetworks />
           <MyCommunities />
           <div className="static__block">

               <div className="static__block_left">

               <div className="signup_header__left">

                <img

                  className="signup_header__logo" style={{width:"60px",height:"60px"}}

                  src="https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/bgc-logo.svg?alt=media&token=0f61a406-04b2-42a7-98ee-43f4d2183524"

                />

              </div>

               </div>

               <div className="static__block_right">

                   <div className="staticnav">
                   <div className="static_link"><a className="static_link_content" href="https://www.blackgirlscode.com/volunteer/" target="_blank"> Volunteer </a><ArrowRightIcon/></div>
                   <div className="static_link"><a className="static_link_content" href="https://www.blackgirlscode.com/donate/" target="_blank">Donate</a> <ArrowRightIcon/></div>
                   <div className="static_link"><a className="static_link_content" href="https://www.blackgirlscode.com/careers/" target="_blank" >BGC Careers </a><ArrowRightIcon /></div>
                   <div className="static_link"><a className="static_link_content" href="https://blackgirlscode.us4.list-manage.com/subscribe/post?u=acf512bf416c8569237ffaf93&id=88a4e53921" target="_blank" >Join Mailing List</a><ArrowRightIcon/></div>

                   </div>
               </div>             

           </div>
        </div>
    );
};


const UserInfo = styled.div`
    border-bottom: 1px solid rgba(0,0,0,0.15);
    padding: 12px 12px 16px;
    word-wrap: break-word;
    word-break: break-word;
`;

const CardBackground = styled.div`
    background: url('/images/card-bg.svg');
    background-position: center;
    background-size: 462px;
    height: 54px;
    margin: -12px -12px 0;
`;

const Photo = styled.div`
    box-shadow: none;
    background-image: url('/images/photo.svg');
    width: 72px;
    height: 72px;
    box-sizing: border-box;
    background-clip: content-box;
    background-color: #ffffff;
    background-position: center;
    background-size: 60%;
    background-repeat: no-repeat;
    border: 2px solid #ffffff;
    margin : -38px auto 12px;
    border-radius: 50%;
`;

// const Link = styled.div`
//     font-size: 16px;
//     line-height: 16px;
//     color: rgba(0,0,0,0.9);
//     font-weight: 600;
// `;

const AddPhotoText = styled.div`
    color: #0a66c2;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.33;
    font-weight: 400;
`;

const Widget = styled.div`
    border-bottom: 1px solid rgba(0,0,0,0.15);
    padding-top: 12px;
    padding-bottom: 12px;

    & > a {
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 12px;

        &:hover {
            background-color: rgba(0,0,0,0.08);
        }

        div {
            display: flex;
            flex-direction: column;
            text-align: left;

            span {
                font-size: 12px;
                line-height: 1.333;

                &:first-child {
                    color: rgba(0, 0, 0, 0.6);
                }

                &:nth-child(2) {
                    color: rgba(0, 0, 0, 1);
                }
            }
        }
    }

    svg {
        color: rgba(0, 0, 0, 1);
    }
`;

const Item = styled.a`
    border-color: rgba(0, 0, 0, 0.8);
    text-align: left;
    padding: 12px;
    font-size: 12px;
    display: block;

    span {
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 1);

        svg {
            color: rgba(0, 0, 0, 0.6);
        }
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }
`;

// const CommunityCard = styled(ArtCard)`
//     padding: 8px 0 0;
//     text-align: left;
//     display: flex;
//     flex-direction: column;

//     a {
//         color: #000000;
//         padding: 4px 12px;
//         font-size: 12px;

//         &:hover {
//             color: #0a66c2;
//         }

//         span {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//         }

//         &:last-child {
//             color: rgba(0,0,0,0.6);
//             text-decoration: none;
//             border-top: 1px solid #d6cec2;
//             padding: 12px;

//             &:hover {
//                 background-color: rgba(0,0,0,0.08);
//             }
//         }
//     }
// `;

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Leftside);
