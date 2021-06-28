import React from 'react';

import { Layout } from '../components/Layout';
import { MarkdownWrapper } from '../components/MarkdownWrapper';

import FaqContent from '../markdown/faq.md';

export const FaqPage: React.FunctionComponent = () => (
  <Layout>
    <MarkdownWrapper>
      <FaqContent/>
    </MarkdownWrapper>
  </Layout>
);