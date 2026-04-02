import { Box, Image } from "@chakra-ui/react";
import Slider from "react-slick";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
const banners = [
  "https://picsum.photos/1200/500?random=1",
  "https://picsum.photos/1200/500?random=2",
  "https://picsum.photos/1200/500?random=3",
  "https://picsum.photos/1200/500?random=4",
];

// Nút trái
const PrevArrow = ({ onClick }) => (
  <Box
    position="absolute"
    left="10px"
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    bg="blackAlpha.600"
    color="white"
    p={2}
    borderRadius="full"
    cursor="pointer"
    onClick={onClick}
    _hover={{ bg: "blackAlpha.800" }}
  >
    <ChevronLeftIcon boxSize={6} />
  </Box>
);

// Nút phải
const NextArrow = ({ onClick }) => (
  <Box
    position="absolute"
    right="10px"
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    bg="blackAlpha.600"
    color="white"
    p={2}
    borderRadius="full"
    cursor="pointer"
    onClick={onClick}
    _hover={{ bg: "blackAlpha.800" }}
  >
    <ChevronRightIcon boxSize={6} />
  </Box>
);

const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Box w="100%" position="relative">
      <Slider {...settings}>
        {banners.map((src, idx) => (
          <Box key={idx}>
            <Image
              src={src}
              w="100%"
              h={["220px", "350px", "500px"]}
              objectFit="cover"
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HomeSlider;