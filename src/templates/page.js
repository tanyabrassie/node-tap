import React from 'react';
import Layout from '../components/layout';
import {graphql} from 'gatsby';

const Page = ({data}) => {
  const pageData = data.markdownRemark;
  const showSidebar = !pageData.fields.slug.indexOf('/docs/');
  return (
    <>
      <Layout showSidebar={showSidebar}>
        <div dangerouslySetInnerHTML={{ __html: pageData.html }} />
      </Layout>
    </>
  )
}

export default Page;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
    }
  }
`