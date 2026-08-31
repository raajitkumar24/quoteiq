# RFQ line matching

Adjudicate a supplier line against retrieved RFQ candidates. Prefer exact
identifiers, dimensions, technical attributes and UOM compatibility before
semantic similarity.

Return match, alternate, one-to-many, many-to-one, not-quoted or needs-review.
Explain using observable attributes. Route high-spend ambiguity to human review.
