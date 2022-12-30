import styled from 'styled-components';
import { Colors } from '@dr-one/utils';

export const Container = styled.section`
  background-color: ${Colors.BLACK};
  display: flex;
  flex-direction: column;
  width: 280px;
  border-radius: 0 6px 6px 0;
  overflow-y: auto;
  -webkit-transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  -ms-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  transition: all 0.4s ease;
`;

export const Logo = styled.div`
  margin-bottom: 50px;
  .logo-wrapper {
    margin-top: 23px;
    padding-left: 25px;
    padding-right: 25px;
    img {
      max-width: 100%;

      &.org-img{
        margin: 0 auto 20px auto;
        display: flex;
        width: 68px;
        border-radius: 6px;
      }
    }


  }
`;

export const Navigation = styled.div`
  .metismenu {
    padding-right: 30px;
    padding-left: 30px;
    path {
      fill: ${Colors.WHITE};
      opacity: 1;
    }
    .active {
      path {
        fill: ${Colors.WHITE};
        opacity: 1;
      }
    }
    li {
      margin-bottom: 10px;
      width: 221px;
      position: relative;

      &.mm-active {
        .nav-links {
          background: none;
        }
      }
      a {
        &.mm-active {
          .nav-links {
            background: ${Colors.PRIMARY};
          }
        }
      }
      .nav-links {
        height: 39px;
        display: flex;
        align-items: center;
        padding-left: 12px;
        border-radius: 6px;
        cursor: pointer;

        .nav-icon {
          width: 28px;
          height: 24px;
          margin-right: 10px;
          text-align: center;
        }
        svg {
          &.MuiSvgIcon-root {
            margin-right: 10px;
            fill: ${Colors.WHITE};
          }
        }
        a {
          padding-right: 15px;
          color: ${Colors.WHITE};
          font-size: 17px;
          line-height: 20px;
          font-weight: 700;
          text-decoration: none;

          &.has-arrow {
            position: relative;
            width: 100%;

            &::after {
              width: 6px;
              height: 6px;
              border-width: 2px 0 0 2px;
              transform: rotate(45deg) translate(0, -50%);
            }

            &.mm-collapsed::after {
              transform: rotate(-135deg) translate(0, -50%);
            }
          }
        }
        &:hover {
          background: ${Colors.PRIMARY};
          opacity: 1;
          path {
            fill: ${Colors.WHITE} !important;
          }
        }
        &.active {
          background: ${Colors.PRIMARY};
        }
      }
      ul {
        margin-left: 47px;
        margin-bottom: 5px;
        margin-top: 5px;
        li {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          a {
            text-decoration: none;
            color: ${Colors.WHITE};
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;

            &:hover {
              background: transparent;
              color: ${Colors.PRIMARY} !important;
            }
            &.active {
              background: transparent;
              color: ${Colors.PRIMARY} !important;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }

        &.mobile-submenu {
          display: none;
        }
      }
      &.single-nav {
        .nav-links {
          .has-arrow {
            &::after {
              display: none;
            }
          }
        }
      }

      &.admin {
        margin-top: 100px;

        .nav-links{
          .makeStyles-root-2{
            display:flex;
            width:auto;
          }

          .MuiSvgIcon-root{
            margin:0 10px 0 0 !important;
            width: 1em !important;
            height: 1em !important;
            font-size: 1.5rem !important;
          }
        }
      }
    }
  }
`;
