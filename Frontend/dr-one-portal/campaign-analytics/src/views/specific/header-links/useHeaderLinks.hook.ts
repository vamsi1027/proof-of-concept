const useHeaderLinks: Function = (): {} => {
  /* Components props */
  const props = {
    breadcrumbs: { separator: '›' },

    link1: { underline: 'hover', color: 'primary', href: '/campaign/manage' },

    link2: { underline: 'hover', color: 'primary', href: '/campaign/manage' },

    current: { color: 'primary' },
  };

  return {
    props,
  };
};

export default useHeaderLinks;
