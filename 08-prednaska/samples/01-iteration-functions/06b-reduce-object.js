[["a", 1], ["b", 2]].reduce((r, [k, v]) => ((r[k] = v), r), {});

x.reduce((r, s) => {
  if (r[s.class]) {
    r[s.class].push(s);
  } else {
    r[s.class] = [];
    r[s.class].push(s);
  }
  return r;
}, {});

x.reduce(
  ([prob, neprob], s) => {
    if (s.class == "a") {
      prob.push(s);
    } else {
      neprob.push(s);
    }
    return r;
  },
  [[], []]
);

x.reduce(
  (r, s) => {
    const [prob, neprob] = r(s.class == "a" ? prob : neprob).push(s);
    return r;
  },
  [[], []]
);
