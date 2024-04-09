import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { banner } from '@/constants/banner';
import { Register } from '@/components';
import { Login } from '@/components';


const Auth = () => {
    const [isRegisterForm, setIsRegisterForm] = useState(true);
    const handleToggleRegister = () => {
        setIsRegisterForm(!isRegisterForm)
    }
    return (
        <main className="flex h-screen">
            <section className="w-0 lg:w-[60%]  h-full">
                <Swiper navigation={true} modules={[Pagination]}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                    className='mySwiper'
                    pagination={{
                        dynamicBullets: true,
                        clickable: true
                    }}
                    loop={true}
                    direction='horizontal'
                    slidesPerView={1}
                >
                    {banner.map((text, i) => (
                        <SwiperSlide key={i} className="relative w-full h-full object-contain">
                            <div className="relative w-full h-full">
                                <img src={text.image} className="w-full h-full" />
                                <div className="absolute inset-0 bg-gray-800 opacity-50"></div> {/* Gray overlay */}
                            </div>
                            <div className="absolute left-10 bottom-32">
                                <h1 className="text-5xl font-bold mb-4 text-white">{text.heading}</h1>
                                <h1 className="text-lg font-medium text-white">{text.subheading}</h1>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            {/* form */}
            {isRegisterForm ?
                <section className="w-full lg:w-[40%] py-4 px-3 lg:px-7 h-full bg-[#e4ab80]">
                    <div className="absolute inset-0 bg-gray-100 opacity-50"></div>
                    <div className='bg-white h-full drop-shadow-lg rounded-xl'>
                        <Register handleToggleRegister={handleToggleRegister} />
                    </div>
                </section> :
                <section className="w-full lg:w-[40%] px-7 h-full flex items-center justify-center bg-[#e4ab80]">
                    <div className="absolute inset-0 bg-gray-100 opacity-50"></div>
                    <div className='bg-white h-[50%] w-full drop-shadow-lg rounded-xl'>
                        <Login handleToggleRegister={handleToggleRegister} />
                    </div>
                </section>}
        </main>
    );
};

export default Auth;
