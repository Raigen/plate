import {
  createStyles,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import { css } from 'styled-components';

export const getThreadStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'Thread',
      ...props,
    },
    {
      root: css`
        position: absolute;
        border-radius: 8px;
        box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
        z-index: 9999;
        background-color: white;
      `,
    }
  );

export const getCommentHeaderStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'CommentHeader',
      ...props,
    },
    {
      root: css`
        box-sizing: content-box;
        font-weight: normal;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-align: left;
        color: black;
        font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        font-size: 14px;
        direction: ltr;
        cursor: default;
        -webkit-user-select: text;
        height: 38px;
        white-space: nowrap;
        display: flex;
        margin: 0;
        padding: 12px;
      `,
    }
  );

export const getAvatarHolderStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'AvatarHolder',
      ...props,
    },
    {
      root: css`
    font-weight: normal;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    text-align: left;
    color: black;
    font-family: "Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif
    font-size: 14px;
    direction: ltr;
    cursor: default;
    -webkit-user-select: text;
    white-space: nowrap;
    height: 38px;
    margin-top: 2px;
    max-width: 36px;
    width: 36px;
      `,
    }
  );

export const getCommentProfileImageStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'CommentProfileImage',
      ...props,
    },
    {
      root: css`
        font-weight: normal;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-align: left;
        color: black;
        font-size: 14px;
        direction: ltr;
        cursor: default;
        -webkit-user-select: text;
        white-space: nowrap;
        width: 32px;
        aspect-ratio: auto 32 / 32;
        height: 32px;
        object-fit: cover;
        left: 0 !important;
        display: block;
        position: relative;
        border-radius: 50%;
        margin-left: 2px;
        margin-top: 2px;
      `,
    }
  );

export const getAuthorTimestampStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'AuthorTimestamp',
      ...props,
    },
    {
      root: css`
        font-weight: normal;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-align: left;
        color: black;
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        cursor: pointer;
        direction: ltr;
        -webkit-user-select: text;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -webkit-box-flex: 1;
        flex-grow: 1;
        display: flex;
        align-items: start;
        flex-direction: column;
        justify-content: center;
      `,
    }
  );

export const getCommenterNameStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'CommenterName',
      ...props,
    },
    {
      root: css`
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-align: left;
        direction: ltr;
        cursor: default;
        -webkit-user-select: text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        height: 18px;
        align-self: stretch;
        color: #3c4043;
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.25px;
        line-height: 20px;
        margin-top: 0;
      `,
    }
  );

export const getCommentInputStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'CommentInput',
      ...props,
    },
    {
      root: css`
        font-weight: normal;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        color: black;
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        white-space: normal;
        font-size: 14px;
        cursor: default;
        -webkit-user-select: text;
        direction: ltr;
        unicode-bidi: isolate;
        border-top: none !important;
        position: relative;
        outline: none;
        zoom: 1;
        border: none;
        background: #fff;
        background-color: #fff;
        border-bottom: none;
        padding: 12px;
        display: block !important;
        padding-top: 0;
        text-align: left;
      `,
    }
  );

export const getTextAreaStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'ThreadTextArea',
      ...props,
    },
    {
      root: css`
        color: #3c4043;
        line-height: 20px;
        height: 38px;
        border: 1px solid #dadce0;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
        min-height: 36px;
        padding: 8px;
        display: block;
        margin: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        outline-width: 0 !important;
        resize: none;
        width: 100%;
        cursor: text;
        text-align: start;
        word-wrap: break-word;
      `,
    }
  );

export const getButtonsStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'Buttons',
      ...props,
    },
    {
      root: css`
        font-weight: normal;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        color: black;
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        white-space: normal;
        font-size: 14px;
        cursor: pointer;
        direction: ltr;
        -webkit-user-select: text;
        zoom: 1;
        text-align: left;
        padding-top: 8px;
        display: block;
      `,
    }
  );

export const getCommentButtonStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'ThreadCommentButton',
      ...props,
    },
    {
      root: css`
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        direction: ltr;
        position: relative;
        display: inline-block;
        cursor: default;
        text-align: center;
        white-space: nowrap;
        outline: 0px;
        margin: 0 8px 0 0;
        min-width: 24px;
        vertical-align: middle;
        border: 1px solid transparent !important;
        border-radius: 4px;
        box-shadow: none;
        box-sizing: border-box;
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.25px;
        line-height: 16px;
        background: #1a73e8;
        height: 24px;
        padding: 3px 12px 5px;
        background-color: #1a73e8;
        color: #fff;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #2b7de9;
          box-shadow: 0 1px 3px 1px rgb(66 133 244 / 15%);
          color: #fff;
        }

        &:active {
          background-color: #63a0ef;
          box-shadow: 0 2px 6px 2px rgb(66 133 244 / 15%);
          color: #fff;
        }
      `,
    }
  );

export const getCancelButtonStyles = (props: StyledElementProps) =>
  createStyles(
    {
      prefixClassNames: 'ThreadCommentButton',
      ...props,
    },
    {
      root: css`
        font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial,
          sans-serif;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        direction: ltr;
        position: relative;
        display: inline-block;
        cursor: default;
        text-align: center;
        white-space: nowrap;
        outline: 0px;
        margin: 0 8px 0 0;
        min-width: 24px;
        vertical-align: middle;
        border-radius: 4px;
        box-shadow: none;
        box-sizing: border-box;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.25px;
        line-height: 16px;
        background: white;
        border: 1px solid #dadce0 !important;
        height: 24px;
        padding: 3px 12px 5px;
        color: #1a73e8;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #f8fbff;
          border-color: #cce0fc !important;
        }

        &:active {
          background-color: #e1ecfe;
          color: #1a73e8;
        }

        &:hover:active {
          box-shadow: 0 2px 6px 2px rgb(60 64 67 / 15%);
        }
      `,
    }
  );
