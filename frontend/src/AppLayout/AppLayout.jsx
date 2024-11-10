import React,{ useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import LoaderAnimation from "./Loader/LoaderAnimation";

const AppLayout = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true); 
    const [animation, setAnimation] = useState(null);
    
    useEffect(() => {
        // Set a 5-second timeout to hide the loader and show content
        const timer = setTimeout(() => {
            setAnimation("animationStart");
            setIsLoading(false);
        }, 1500);

        // Clean up the timer on component unmount
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (location.state && location.state.action === "loading") {
            setAnimation(null);
            setIsLoading(true); 
        }
    }, [location]);

    return (
        <>
            <main
                style={isLoading ? { overflowY: 'hidden', height: '100px', width: '100px', zIndex: 999 } : { overflowY: 'hidden', height: 'auto', width: 'auto' }}
                className={animation}
            >
                {isLoading && <LoaderAnimation />}
                <Outlet />
            </main>
        </>
    );
};

export default AppLayout;
