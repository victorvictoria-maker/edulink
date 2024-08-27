"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { GiHospital } from "react-icons/gi";
import { TbBuildingEstate } from "react-icons/tb";
import { MdOutlineCalendarMonth, MdOutlinePeople } from "react-icons/md";
import { LiaUniversitySolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Hospitaltypes from "./hospitaltypes";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const Herosection = () => {
  // Scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Section 1: Hero Section */}
      <motion.section
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <div className='max-w-[1400px] mx-auto flex flex-col md:flex-row items-center py-6 md:py-12 px-4'>
          <motion.div
            className='text-content md:w-1/2 space-y-4'
            variants={fadeInUp}
          >
            <p className='flex items-center text-[#a30000]'>
              <span className='icon-love mr-1'>❤️</span> Education Comes First
            </p>
            <h1 className='text-4xl md:text-7xl font-bold md:pb-4'>
              EduLink: <br /> Connecting Students with{" "}
              <span className='lg:block'>HODs</span>
            </h1>
            <p className='md:pb-12 md:w-4/5 text-gray-700'>
              Our mission is to bridge the gap between students and academic
              heads, ensuring a seamless connection to the support and guidance
              you need. With access to a network of educational leaders, EduLink
              is your trusted partner in navigating your academic journey.
            </p>

            <div className=' space-x-6 '>
              <Button variant='red' size='lg'>
                <Link href='/dashboard/appointments/book'>Book Apointment</Link>
              </Button>
              <Button variant='white' size='lg'>
                <Link href='/login'>Login</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className='images md:w-1/2 flex justify-center gap-2 md:gap-4 items-center mt-8 md:mt-0 relative'
            variants={fadeInUp}
          >
            <div className='w-1/3 relative block md:hidden lg:block'>
              <Image
                src='/images/student2.png'
                alt='Small Image'
                className='object-cover w-full h-full'
                width={200}
                height={500}
              />
            </div>

            <div className='w-2/3 relative'>
              <Image
                src='/images/heroimg.png'
                alt='Large Image'
                className='object-cover w-full h-full'
                width={300}
                height={500}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2: Statistics Section */}
      <motion.section
        className='max-w-[1400px] mx-auto bg-gray-100 py-8 my-2 px-4'
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <div className='mx-auto flex flex-col md:flex-row gap-8 justify-between items-center space-y-2 md:space-y-0 md:space-x-4'>
          <motion.div
            className='flex flex-col md:flex-row md:gap-4 items-center text-center flex-1 justify-center'
            variants={fadeInUp}
          >
            <div className='bg-[#04A5BA] p-6 rounded-md'>
              <MdOutlineCalendarMonth size={24} color='white' />{" "}
              {/* Change to appropriate icon */}
            </div>
            <div className='mt-4'>
              <p
                className='font-bold text-xl text-[#04A5BA]'
                data-target='2000'
              >
                2,000+
              </p>
              <p className='font-bold'>Students</p>
            </div>
          </motion.div>

          <motion.div
            className='flex flex-col md:flex-row md:gap-4 items-center text-center flex-1 justify-center'
            variants={fadeInUp}
          >
            <div className='bg-[#EFCB68] p-6 rounded-md'>
              <LiaUniversitySolid size={24} color='white' />{" "}
              {/* Change to appropriate icon */}
            </div>
            <div className='mt-4'>
              <p className='font-bold text-xl text-[#EFCB68]' data-target='50'>
                50+
              </p>
              <p className='font-bold'>Departments</p>
            </div>
          </motion.div>

          <motion.div
            className='flex flex-col md:flex-row md:gap-4 items-center text-center flex-1 justify-center'
            variants={fadeInUp}
          >
            <div className='bg-[#456DFF] p-6 rounded-md'>
              <MdOutlinePeople size={24} color='white' />{" "}
              {/* Change to appropriate icon */}
            </div>
            <div className='mt-4'>
              <p className='font-bold text-xl text-[#456DFF]' data-target='500'>
                1
              </p>
              <p className='font-bold'>Academic Head</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Feedback Section */}
      <motion.section
        className='feedback-section bg-white py-16'
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <div className='container mx-auto flex flex-col md:flex-row gap-8 items-center'>
          {/* Left: Image */}
          <motion.div className='image md:w-1/2' variants={fadeInUp}>
            <Image
              src='/images/student3.png'
              alt='Feedback Image'
              className='w-full'
              width={400}
              height={400}
            />
            {/* <Image width={210} height={200} alt='Logo' src='/images/logo.png' /> */}
          </motion.div>
          {/* Right: Text and Cards */}
          <motion.div
            className='text-content md:w-1/2 space-y-6 mt-4 md:mt-0 '
            variants={fadeInUp}
          >
            <h2 className='text-xl md:text-3xl font-bold'>
              We support your academic journey. Connecting you to educational
              leaders.
            </h2>
            <p className='text-gray-700'>
              At EduLink, we are dedicated to streamlining your academic journey
              with essential tools and resources. Our goal is to make it easy
              for you to schedule appointments with your department heads. With
              up-to-date information on available slots and approval statuses,
              we ensure that booking a meeting is straightforward and efficient.
              Rely on us to facilitate your appointment process and provide the
              support you need to connect with your academic leaders seamlessly.
            </p>
            <div className='feedback-cards grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='feedback-card p-4 bg-blue-50'>
                <p className='text-lg font-semibold'>Positive Feedback</p>
                <div className='progress-bar bg-[#a30000] w-3/4 h-2 rounded-full mt-2'></div>
                <p className='mt-2 text-gray-700'>90% satisfaction rate</p>
              </div>
              <div className='feedback-card p-4 bg-blue-50'>
                <p className='text-lg font-semibold'>Student Utilization</p>
                <div className='progress-bar bg-[#104a36] w-4/5 h-2 rounded-full mt-2'></div>
                <p className='mt-2 text-gray-700'>2,000+ other students</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 4: Hospital Types Section*/}
      {/* <Hospitaltypes /> */}

      {/* Section 5: What you would get Section */}
      <motion.section
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <div className='max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:py-12 px-4 my-4'>
          <motion.div
            className=' lg:w-2/3 space-y-4 lg:pr-16 pt-3 mb-4'
            variants={fadeInUp}
          >
            <h2 className='text-xl md:text-3xl font-bold'>
              Connecting Students to Academic Leaders
            </h2>
            <p className='text-gray-700'>
              EduLink streamlines the appointment process, making it easier for
              students to connect with their Heads of Department and academic
              advisors.
            </p>
            <ul className='space-y-2 text-gray-700'>
              <li className='flex items-center gap-1'>
                <FaCheck /> Schedule meetings with academic heads
              </li>
              <li className='flex items-center gap-1'>
                <FaCheck /> Institution-wide access for all students
              </li>
              <li className='flex items-center gap-1'>
                <FaCheck /> Trusted by leading educational institutions
              </li>
              <li className='flex items-center gap-1'>
                <FaCheck /> Simple and efficient booking system
              </li>
              <li className='flex items-center gap-1'>
                <FaCheck /> Easy to use and navigate
              </li>
            </ul>

            <Button variant='red' size='lg'>
              <Link href='/hospitals'>Learn More</Link>
            </Button>
          </motion.div>
          <motion.div
            className='lg:w-1/2 flex flex-col items-center relative h-full w-full '
            variants={fadeInUp}
          >
            <div className=' lg:w-13/  flex flex-col gap-4 w-full md:justify-center md:items-center  lg:flex-row'>
              <div>
                <Image
                  src='/images/student.jpg'
                  alt='Image 1'
                  className=' w-full h-full rounded-md'
                  width={300}
                  height={500}
                />
              </div>
              <div className='flex flex-col gap-4 md:flex-row lg:flex-col'>
                <Image
                  src='/images/happy-students.jpg'
                  alt='Image 1'
                  className=' w-full h-full rounded-md'
                  width={300}
                  height={500}
                />
                <Image
                  src='/images/happy-student.jpg'
                  alt='Image 1'
                  className=' w-full h-full rounded-md'
                  width={400}
                  height={600}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Herosection;
