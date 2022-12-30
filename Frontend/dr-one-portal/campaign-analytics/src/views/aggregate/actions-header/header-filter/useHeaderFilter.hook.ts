import { MenuItemType } from '../../../../models';
import { icon_filter } from '../../../../assets';
import { useState, MouseEvent, useEffect } from 'react';

/* props definition */
export type Props = {
  menuItems: MenuItemType[];
  setSelectedItem: Function;
};

const useHeaderFilter: Function = ({
  menuItems,
  setSelectedItem,
}: Props): {} => {
  /* Current bind element for menu */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  /* Menu state */
  const isMenuOpen = Boolean(anchorEl);
  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /* Menu items state */
  const [campaigns, setCampaigns] = useState<MenuItemType[]>();
  useEffect(() => {
    setCampaigns(menuItems);
  }, [menuItems]);

  /* Current selected menu item */
  const [currentSelected, setCurrentSelected] = useState<MenuItemType[]>([]);
  const onSelectMenuItem = (item: MenuItemType) => {
    if (Array.isArray(item.value)) {
      setCurrentSelected([item]);
      setNextLevel([...item.value]);
      setSelectedItem([]);
      return;
    }
    const auxList = [
      ...currentSelected.filter(
        (cs) => cs.id !== item.id && !Array.isArray(cs.value)
      ),
    ];

    const newSelected =
      auxList.length === currentSelected.length ? [...auxList, item] : auxList;

    setCurrentSelected(newSelected);
    setNextLevel(undefined);
    setSelectedItem(newSelected);
  };

  /* Manage next level */
  const [nextLevel, setNextLevel] = useState<MenuItemType[]>();

  /* Components props */
  const props = {
    button: {
      onClick: handleOpenMenu,
      variant: 'outlined',
    },

    label:
      currentSelected.length > 1
        ? `Selected ${currentSelected.length}`
        : currentSelected[0]
        ? currentSelected[0].label
        : 'Custom filter',

    icon: {
      alt: 'Custom filter',
      src: icon_filter,
    },

    filter: {
      anchorEl: anchorEl,
      handleClose: handleCloseMenu,
      isOpen: isMenuOpen,
      menuItems: campaigns,
      onSelected: onSelectMenuItem,
      currentSelected: currentSelected,
    },
  };

  return { props, nextLevel };
};

export default useHeaderFilter;
