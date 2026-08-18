import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Banner } from "@/types";
import { Colors, BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_HEIGHT = 180;

interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  onBannerPress?: (banner: Banner) => void;
}

export default function BannerCarousel({
  banners,
  autoPlay = true,
  interval = 4000,
  onBannerPress,
}: BannerCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (SCREEN_WIDTH - 32),
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, interval);
    return () => clearInterval(timer);
  }, [activeIndex, autoPlay, banners.length, interval]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(
      contentOffset / (SCREEN_WIDTH - 32)
    );
    setActiveIndex(index);
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "sale":
        return Colors.accent;
      case "category":
        return Colors.info;
      default:
        return Colors.green;
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={SCREEN_WIDTH - 32}
        decelerationRate="fast"
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            onPress={() => onBannerPress?.(banner)}
            activeOpacity={0.9}
            style={{
              width: SCREEN_WIDTH - 32,
              height: BANNER_HEIGHT,
              marginRight: 0,
            }}
          >
            <Image
              source={{ uri: banner.image }}
              contentFit="cover"
              transition={500}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: BorderRadius.lg,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View className="flex-row justify-center mt-3 gap-1.5">
          {banners.map((_, index) => (
            <View
              key={index}
              className="rounded-full"
              style={{
                width: index === activeIndex ? 20 : 8,
                height: 8,
                backgroundColor:
                  index === activeIndex ? Colors.green : Colors.border,
                borderRadius: 4,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
