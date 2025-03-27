import React, { useMemo } from "react";
import { UIMatch, useMatches } from "react-router-dom";

import styles from "./BreadCrumb.module.css";

type HandleType = {
  crumb: React.ReactNode;
};

function Breadcrumbs() {
  const matches = useMatches() as UIMatch<unknown, HandleType>[];

  const crumbs = useMemo(() => {
    return matches
      .filter((match) => match.handle != null && match.handle.crumb)
      .map((match) => match.handle.crumb);
  }, [matches]);

  return (
    <nav>
      <ol className={styles.breadcrumb}>
        {crumbs.map((crumb, index) => (
          <li key={index}>{crumb}</li>
        ))}
      </ol>
    </nav>
  );
}

export default React.memo(Breadcrumbs);
