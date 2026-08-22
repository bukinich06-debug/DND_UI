import { IconHeart, IconShield, IconStar, IconSword } from "@/components/shared/icon";

interface IItemIconProps {
  category: string;
}

export const ItemIcon = ({ category }: IItemIconProps) => {
  if (category === "weapons") return <IconSword />;
  if (category === "armor") return <IconShield />;
  if (category === "consumables") return <IconHeart />;
  return <IconStar />;
};
