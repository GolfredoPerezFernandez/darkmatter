import { FC, useState, useEffect, SyntheticEvent, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useAccount } from 'wagmi'
import './pages.css'
import Box from "@mui/material/Box";
import { TypeAnimation } from 'react-type-animation';
import {  Button } from '@web3uikit/core';

const Home: FC = () => {
  const [blogs, setBlogs] = useState<(object | undefined)[] | undefined>();
  const { address, isConnected } = useAccount();
  const [tabValue, setTabValue] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);


  const fetchAllNftsByUser = useCallback(async () => {
    setIsFetching(true);
    const res = await axios.get(`${process.env.REACT_APP_BACKEND}/getAllBlogsByUserAddress`, {
      params: {
        address,
      }
    });
    setBlogs(res?.data);
    setIsFetching(false);
  }, [address]);

  const fetchAllNfts = useCallback(async () => {
    setIsFetching(true);
    const res = await axios.get(`${process.env.REACT_APP_BACKEND}/getAllBlogs`);
    setBlogs(res?.data);
    setIsFetching(false);
  }, []);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    switch (tabValue) {
      case 0:
        fetchAllNfts();
        break;
      case 1:
      default:
        fetchAllNftsByUser();
        break;
    }
  }, [fetchAllNfts, fetchAllNftsByUser, tabValue]);

  return (<>
      <Grid container style={{borderWidth:20,height:"100%",borderColor:'#0B0D21'}} direction="column">
      <video style={{opacity:1, background:'black',backgroundColor:'black'}} id="background-video" autoPlay={true} loop muted >
<source src="https://bafybeidzvdmct63yfx7loa2agzbkzwnodifeue2cjzlxhls535j6h2wedi.ipfs.w3s.link/Untitled_design_2.mp4" type="video/mp4"/>
  
</video> 
<Box style={{justifyContent:'center',alignSelf:'center',marginTop:"7%",alignItems:'center'}}>

<img src={"https://bafkreihqk5wioasct3k25yzpfcsombtq6byeo2jl2pcwh4isnymknbsp6a.ipfs.nftstorage.link/"} style={{alignSelf:'center',marginBottom:'-50px'}} alt="logo" width="800px" />

<TypeAnimation
      sequence={[
        'INTERACTIVE SPACEGAME COMMUNITY DRIVEN & FINANCES.', 
        3000, 
        'SUSTAINABLE AND DECENTRALIZED.',
        3000,
        'YIELD OPTIMIZER ON POLYGON.',
        3000,
        'DeFI, DAO & MARKETPLACE.',
        3000,
      ]}
      wrapper="div"
      cursor={true}
      repeat={Infinity}
      style={{ fontSize: '2em',width:"800px",fontWeight:500,color:'white',textAlign:'center' }}
     />

<Box style={{marginLeft:"30%",width:300,justifyContent:'center',alignSelf:'center',marginTop:"5%",alignItems:'center'}}>

<Button theme="primary"  isFullWidth={true}  type="button" text="DeFi" />
<Box style={{height:10}}></Box>
<Button theme="secondary"  isFullWidth={true}  type="button" text="Mint" />
</Box>
    </Box>
      </Grid>
       </>
  );
};

export default Home;
