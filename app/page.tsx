import TopicFilter from "../components/TopicFilter";
import Header from "../components/Header";
import JournalHome from "../components/JournalHome";
import { getPosts } from "../lib/posts";

export default function Home() {
  const posts = getPosts().map(({ slug, title, description, category, publishedAt }) => ({
    slug, title, description, category, publishedAt,
  }));
  return <><Header sticky topicFilter={<TopicFilter posts={posts} />} /><JournalHome posts={posts} /></>;
}
