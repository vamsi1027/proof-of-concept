import { MenuItemType } from '../../models';
import { PopoverOrigin, Size } from '@material-ui/core';
import { classNames } from '../../utils';
import { useState, useMemo } from 'react';

/* Prop definition */
export type Props = {
  className?: string;
  menuItems?: MenuItemType[];
  anchorEl: null | HTMLElement;
  isOpen: boolean;
  handleClose: VoidFunction;
  onSelected: Function;
  currentSelected: MenuItemType[];
};

const useCustomFilter: Function = ({
  className,
  anchorEl,
  isOpen,
  menuItems,
  handleClose,
  onSelected,
  currentSelected,
}: Props): {} => {
  /* Menu close action */
  const closeMenu = () => {
    handleClose();

    setKeyword('');
  };

  /* local ref */
  const [localAnchorEl, setlocalAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(localAnchorEl);
  const handleLocalClick = (event: any, item: MenuItemType) => {
    if (Array.isArray(item.value)) {
      onSelected(item);

      closeMenu();

      return;
    }

    onSelected(item);
    //closeMenu();
  };
  const handleLocalClose = () => {
    setlocalAnchorEl(null);

    closeMenu();
  };

  const [keyword, setKeyword] = useState('');

  const filteredData = useMemo(() => {
    return menuItems?.filter((item) =>
      item.label.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
    );
  }, [keyword, menuItems]);

  /* Components prop definition */
  const props = {
    /* Menu parent */
    parent: {
      className: classNames('', className),
      anchorEl: anchorEl,
      open: isOpen,
      onClose: closeMenu,
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      } as PopoverOrigin,
      PaperProps: {
        style: {
          width: '20ch',
        },
      },
    },

    /* Input filter */
    filter: {
      placeholder: 'Search...',
      size: 'small' as Size,
      style: {
        padding: '0.5rem',
      },
      onChange: (event: any) => setKeyword(event?.target?.value),
      value: keyword,
    },

    /* Item container */
    items: {
      style: {
        maxHeight: '15rem',
        overflow: 'auto',
      },
    },

    /* Menu item */
    menuItem: (item: MenuItemType) => ({
      onClick: (event: any) => handleLocalClick(event, item),
    }),

    /* Menu item checkbox */
    checkbox: (item: MenuItemType) => ({
      checked: currentSelected.find((cs) => cs.id === item.id) !== undefined,
    }),

    /* Menu nested */
    nested: (items: MenuItemType[]) => ({
      isOpen: open,
      anchorEl: localAnchorEl,
      handleClose: handleLocalClose,
      menuItems: items,
      onSelected: onSelected,
      currentSelected: currentSelected,
    }),
  };

  return {
    filteredData,
    props,
  };
};

export default useCustomFilter;
