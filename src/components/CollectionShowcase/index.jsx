import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ColorThief from "colorthief";
import ProductRetro from "../ProductsRetro";

const CollectionShowcase = ({ collection }) => {
  const [colors, setColors] = useState({
    dominant: "#7b8361",
    secondary: "#a0a88a",
  });
  const imgRef = useRef(null);
  const { scrollY } = useScroll();

  // 🔧 Giới hạn hiệu ứng parallax tùy thiết bị
  const [maxTranslate, setMaxTranslate] = useState(80);
  useEffect(() => {
    const updateTranslate = () => {
      if (window.innerWidth < 640) setMaxTranslate(40); // mobile
      else if (window.innerWidth < 1024) setMaxTranslate(70); // tablet
      else setMaxTranslate(120); // desktop
    };
    updateTranslate();
    window.addEventListener("resize", updateTranslate);
    return () => window.removeEventListener("resize", updateTranslate);
  }, []);

  const parallaxY = useTransform(scrollY, [0, 400], [0, maxTranslate]);

  // 🌈 Lấy màu chủ đạo & phụ từ banner
  useEffect(() => {
    if (!collection?.banner) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = collection.banner;
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 2);
      if (palette?.length) {
        const [main, sub] = palette;
        const dominant = `rgb(${main[0]}, ${main[1]}, ${main[2]})`;
        const secondary = `rgb(${sub[0]}, ${sub[1]}, ${sub[2]})`;
        setColors({ dominant, secondary });
      }
    };
  }, [collection?.banner]);

  if (!collection) return null;

  return (
    <motion.section
      className="w-full mb-16 sm:mb-24 lg:mb-28"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* 🕹 Banner có parallax */}
      <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
        <motion.img
          ref={imgRef}
          src={collection.banner}
          alt={collection.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-t-lg"
          style={{ y: parallaxY }}
        />

        {/* Overlay gradient nhẹ */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" /> */}

        {/* Text Overlay */}
        <motion.div
          className="absolute bottom-[2%] left-[6%] sm:left-[8%] hidden lg:block text-white max-w-[90%] sm:max-w-[650px] z-10"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-7xl font-extrabold uppercase tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] leading-tight">
            {collection.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-3 md:mt-4 leading-relaxed opacity-90 italic">
            {collection.description ||
              "Khám phá bộ sưu tập mới nhất từ LaminDenim."}
          </p>

          <button
            onClick={() =>
              (window.location.href = `/collection/${collection._id}`)
            }
            className="mt-6 sm:mt-8 px-5 sm:px-7 py-2 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base"
          >
            Xem ngay →
          </button>
        </motion.div>
      </div>

      {/* 🌈 Gradient nền tự động đổi màu */}
      <motion.div
        className="w-full pt-4 sm:pt-8 pb-4 px-2 sm:px-4 md:px-6 relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all duration-700 rounded-b-lg md:rounded-b-2xl"
        style={{
          background: `linear-gradient(180deg, ${colors.dominant} 0%, ${colors.secondary} 100%)`,
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <ProductRetro data={collection.products || []} />

        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-2 bg-white text-[#001F5D] hover:bg-[#001F5D] hover:text-white rounded-md font-semibold transition-all duration-300 shadow-md text-sm sm:text-base"
            onClick={() =>
              (window.location.href = `/collection/${collection._id}`)
            }
          >
            Xem tất cả →
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CollectionShowcase;
