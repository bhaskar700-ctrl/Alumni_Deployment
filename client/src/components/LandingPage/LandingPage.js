import React from 'react';
import HeroSection from './HeroSection/HeroSection';
import AboutUs from './AboutSection/AboutSection';
import FeaturesSection from './FeatureSection/FeatureSection';
import TestimonialsSection from './TestimonialsSection/TestimonialsSection';
import CTASection from './CTASection/CTASection';
import PictureGallerySection from './PictureGallerySection/PictureGallerySection';

const LandingPage = () => {
    return (
        <div className="flex flex-col">
            <PictureGallerySection />
            <HeroSection />
            <AboutUs />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
};

export default LandingPage;
