import React, { useEffect } from 'react';
import { Container, Grid, Button, Box, Typography } from "@mui/material";
import Header from "./../components/common/header";
import CalendarComponent from "./../components/common/calendar";
import Footer from "./../components/common/footer";
import Gallery from "./../components/common/gallery";
import AnnouncementSection from "./../components/common/announcements";
import Api from '../api/auth';

const  Home  = () => {
    const announcements = [
        "Petrichor announced the launch of very first edition of their flagship event, the National Technology and Entrepreneurship Summit on September 16-19,2021. The Summit was held in a virtual mode with the participation of students from across the country. Themed on Technology for Tomorrow, the summit aimed at providing the participants with an ideal opportunity to explore the contemporary trends in technology and acquire some essential knowledge and skills.",
        "As a part of the INTER-IIT Tech Symphony, The Robotics Club, IIT Palakkad is organising a robotic-simulation competition - Programobot. The participants will have to flex their brains to come up with robust control algorithms for a given bot. There is absolutely no limit for trial and error as it is a simulation.",
        "The basic idea is to make people interact, present their analysis by making best predictions and discussing the game of cricket with fellow IITpkd mates. Please note that their is no betting inolved, free to join and planned solely for entertainment purpose.",
        "Akshar, the literary arts society of IIT Palakkad, conducted two competitions- on essay writing and on slogan writing. The compeition was open to all students, staff, faculty and their family. The themes or topics for the competitions were: Forest conservation, water conservation or swachchta. The competitions concluded on 22nd of Sept and the entries received are currently under review..",
        "YACC is starting a CP Topics Discussion Series on a weekly/biweekly basis where we will be covering the important and essential topics for CP. It will help students all while participating in contests and improve your knowledge on these topics and also with internships/placements.",
        "Upcoming software patch includes several bug fixes and performance enhancements.",
        "The cloud storage solution has been upgraded; please clear your cache after April 10th.",
        "Be aware that the new encryption method will be implemented next month, training available.",
        "Technical debt review meeting scheduled for April 8th at 3 PM.",
        "Please submit your feedback on the new internal documentation by the end of this week."
    ];
    const events = [
        { date: '2025-04-03', name: 'Event 1' },
        { date: '2025-04-10', name: 'Event 2' },
        { date: '2025-04-15', name: 'Event 3' },
    ];
    const about_images = ['/about/photo1.jpg', '/about/photo2.jpg', '/about/photo3.jpg', '/about/photo1.jpg', '/about/photo2.jpg', '/about/photo3.jpg'];
    const council_images = ['/councils/photo1.jpg', '/councils/photo2.jpg', '/councils/photo3.jpg', '/councils/photo1.jpg', '/councils/photo2.jpg', '/councils/photo3.jpg'];
    return (
        <div id='home'>
            <Header />
            <Container maxWidth="lg"  alignItems="flex-end">
                <Grid container spacing={2} style={{ marginTop: '20px' }} justifyContent="flex-center" direction="column" wrap="nowrap">
                    <Grid container item id="announcements" xs={12} sx={{ justifyContent: "space-between",'@media (max-width: 600px)': {justifyContent: "space-around",},}} spacing={2} direction="row" justifyContent="space-between">
                        <Grid item xs={6} md={6}>
                            <AnnouncementSection announcements={announcements} />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <CalendarComponent events={events} />
                        </Grid>
                    </Grid>
                    <Grid item id="about-us" xs={12} spacing={4}>
                        <Box mt={4} >
                            <Typography  sx={{ fontFamily: 'Poppins, sans-serif', fontSize: {xs: '1.4rem', sm: '1.6rem', md: '1.8rem',}}}>
                                About Us</Typography>
                            <Typography sx={{ fontSize: {xs: '0.8rem', sm: '0.9rem', md: '1rem',} }}>
                                The Technical Council of IIT Palakkad is a dynamic group dedicated to promoting innovation, technical excellence, and collaboration within the academic community. Comprising talented students, faculty, and professionals, our council aims to bridge the gap between classroom learning and real-world technological applications. We organize events, workshops, and seminars to enhance the skills of students, while fostering a spirit of teamwork and leadership. Through collaboration with industry leaders and experts, the Technical Council seeks to provide students with opportunities to engage with cutting-edge technologies and stay ahead of industry trends. We are committed to creating a platform where creativity meets technology, empowering students to excel in their academic and professional pursuits.</Typography>
                        </Box>
                        <Box>
                            <Gallery images={about_images} galleryId="firstGallery" />
                        </Box>
                    </Grid>
                    <Grid item id="councils" xs={12}>
                        <Box mt={4}>
                            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: {xs: '1.4rem', sm: '1.6rem', md: '1.8rem',}}}>
                                Councils</Typography>
                            <Typography sx={{ fontSize: {xs: '0.8rem', sm: '0.9rem', md: '1rem',} }}>
                                The councils at IIT Palakkad play a pivotal role in enhancing the campus experience by promoting student leadership, collaboration, and innovation across various domains. Each council is dedicated to a specific aspect of student life, be it academics, culture, sports, or technology, providing students with the opportunity to develop their skills, contribute to the community, and lead impactful initiatives. These councils work closely with faculty, administration, and industry professionals to organize events, workshops, and activities that foster growth, creativity, and personal development. Through their diverse activities, the councils ensure that every student has the opportunity to engage with their interests, cultivate leadership qualities, and make meaningful contributions to both the college and society.</Typography>
                        </Box>
                        <Gallery images={council_images} galleryId="secondGallery" />
                    </Grid>
                </Grid>
        </Container>
        <Footer />
        </div>
    );
}

export default Home;