import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🚀 빠른 속도',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        최적화된 코드로 빠른 로딩 속도를 제공합니다. 
        사용자 경험을 위한 성능 최적화가 적용되어 있습니다.
      </>
    ),
  },
  {
    title: '📱 반응형 디자인',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        모든 기기에서 완벽한 표시를 보장합니다. 
        데스크톱부터 모바일까지 일관된 사용자 경험을 제공합니다.
      </>
    ),
  },
  {
    title: '🎨 깔끔한 디자인',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        모던하고 직관적인 UI로 사용하기 쉬운 인터페이스를 제공합니다.
        개발자 친화적인 문서 환경을 구축했습니다.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
