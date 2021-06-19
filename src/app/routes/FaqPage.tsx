import React from 'react';

import { MarkdownWrapper } from '../components/MarkdownWrapper';

import FaqContent from '../markdown/faq.md';

export const FaqPage: React.FunctionComponent = () => (
  <MarkdownWrapper>
    <FaqContent/>
  </MarkdownWrapper>
);