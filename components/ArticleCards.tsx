import styles from "./ArticleCards.module.css";

type SummaryItem = { name: string; description: string; href: string };

export function ArticleSummaryCard({ items, checkedAt, children }: {
  items: SummaryItem[];
  checkedAt: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={styles.summary} aria-label="글 요약과 자료 확인일">
      <div className={styles.heading}>
        <strong>30초 요약</strong>
        <span className={styles.badge}>공식 문서 기반 비교</span>
      </div>
      <div className={styles.intro}>{children}</div>
      <dl className={styles.summaryItems}>
        {items.map((item) => (
          <div key={item.name}>
            <dt><a href={item.href}>{item.name}<span aria-hidden="true"> ↗</span></a></dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.meta}>
        <span>자료 확인 <time dateTime={checkedAt}>{checkedAt.replaceAll("-", ".")}</time></span>
        <span>실행 성능 미측정</span>
        <a href="#references">출처 확인</a>
      </div>
    </aside>
  );
}

type ComparisonRow = { title: string; condition: string; outcome: string };

export function ArticleComparisonCards({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className={styles.comparison}>
      <div className={`${styles.desktop} article-table-wrap`}>
        <table>
          <caption>같은 작업으로 비교하기 · 실험 제안, 실측 전</caption>
          <thead><tr><th scope="col">실험</th><th scope="col">동일하게 맞출 조건</th><th scope="col">확인할 결과</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.title}><th scope="row">{row.title}</th><td>{row.condition}</td><td>{row.outcome}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <div className={styles.mobile}>
        <p className={styles.note}>실험 제안 · 아직 측정한 결과는 없습니다.</p>
        {rows.map((row, index) => (
          <section className={styles.comparisonCard} key={row.title} aria-label={row.title}>
            <div className={styles.cardHeading}>
              <span aria-hidden="true" className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{row.title}</h3>
            </div>
            <dl>
              <div><dt>동일하게 맞출 조건</dt><dd>{row.condition}</dd></div>
              <div><dt>확인할 결과</dt><dd>{row.outcome}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
