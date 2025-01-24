import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents } from "../../mdx-components";

export function generateStaticParamsFor(param) {
  return async () => {
    let data;
    try {
      data = JSON.parse('[""]'); // Replace this with the actual data source
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      throw error;
    }

    const params = [];
    for (let item of data) {
      const keys = Object.keys(await importPage(item));
      params.push(...keys.map((key) => ({ [param]: key.split("/") })));
    }
    return params;
  };
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = useMDXComponents().wrapper;

export default async function Page(props) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
