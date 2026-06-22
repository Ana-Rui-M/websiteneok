import { describe, it, expect } from "@jest/globals";
import {
  MUSICAL_INSTRUMENTS_GRADE_KEY,
  normalizeGradeKey,
  resolveEffectiveGradeKey,
  resolveReadingPlanBucket,
  sortGradeKeys,
  isMusicalInstrumentsGrade,
  isDidacticGradeRange,
} from "../lib/reading-plan-utils";

describe("reading-plan-utils", () => {
  describe("resolveEffectiveGradeKey", () => {
    it("assigns game products to musical instruments regardless of stored grade", () => {
      expect(resolveEffectiveGradeKey("game", "didactic_aids")).toBe(
        MUSICAL_INSTRUMENTS_GRADE_KEY
      );
      expect(resolveEffectiveGradeKey("game", "5")).toBe(
        MUSICAL_INSTRUMENTS_GRADE_KEY
      );
    });

    it("keeps book products on their original grade", () => {
      expect(resolveEffectiveGradeKey("book", "5")).toBe("5");
      expect(resolveEffectiveGradeKey("book", "didactic_aids")).toBe(
        "didactic_aids"
      );
    });
  });

  describe("resolveReadingPlanBucket", () => {
    it("never assigns game products to didactic_aids", () => {
      expect(resolveReadingPlanBucket("didactic_aids", "didactic_aids", "game")).toBe(
        "recommended"
      );
    });

    it("assigns didactic grade ranges to didactic_aids for books", () => {
      expect(resolveReadingPlanBucket("1-4", "mandatory", "book")).toBe(
        "didactic_aids"
      );
    });
  });

  describe("sortGradeKeys", () => {
    it("places musical instruments after didactic aids", () => {
      expect(sortGradeKeys("didactic_aids", MUSICAL_INSTRUMENTS_GRADE_KEY)).toBeLessThan(0);
      expect(sortGradeKeys("5", MUSICAL_INSTRUMENTS_GRADE_KEY)).toBeLessThan(0);
    });
  });

  describe("normalizeGradeKey", () => {
    it("normalizes musical instruments aliases", () => {
      expect(normalizeGradeKey("Instrumentos Musicais")).toBe(
        MUSICAL_INSTRUMENTS_GRADE_KEY
      );
      expect(normalizeGradeKey("Musical Instruments")).toBe(
        MUSICAL_INSTRUMENTS_GRADE_KEY
      );
    });
  });

  describe("isMusicalInstrumentsGrade", () => {
    it("identifies musical instruments grade key", () => {
      expect(isMusicalInstrumentsGrade(MUSICAL_INSTRUMENTS_GRADE_KEY)).toBe(true);
      expect(isMusicalInstrumentsGrade("5")).toBe(false);
    });
  });

  describe("isDidacticGradeRange", () => {
    it("does not treat musical instruments as didactic range", () => {
      expect(isDidacticGradeRange(MUSICAL_INSTRUMENTS_GRADE_KEY)).toBe(false);
    });
  });
});
