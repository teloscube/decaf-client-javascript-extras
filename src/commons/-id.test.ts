import { DecafActionId, DecafArtifactId, DecafArtifactTypeId, mkDecafRecordId, unDecafRecordId } from './-id';

describe('DECAF record identifier tests', () => {
  test('types are aligned and inferred correctly', () => {
    const exampleDecafArtifactId: DecafArtifactId = mkDecafRecordId(42);
    const exampleDecafArtifactIdValue: number = unDecafRecordId(exampleDecafArtifactId);
    expect(exampleDecafArtifactIdValue).toBe(42);

    const exampleDecafActionId: DecafActionId = mkDecafRecordId(42);
    const exampleDecafActionIdValue: number = unDecafRecordId(exampleDecafActionId);
    expect(exampleDecafActionIdValue).toBe(42);

    const exampleDecafArtifactTypeId: DecafArtifactTypeId = mkDecafRecordId('CCY');
    const exampleDecafArtifactTypeIdValue: string = unDecafRecordId(exampleDecafArtifactTypeId);
    expect(exampleDecafArtifactTypeIdValue).toBe('CCY');
  });

  test('type erasure works as expected', () => {
    interface DecafArtifact {
      id: DecafArtifactId;
      type: DecafArtifactTypeId;
    }

    const exampleDecafArtifact: DecafArtifact = { id: mkDecafRecordId(10), type: mkDecafRecordId('CCY') };
    expect(exampleDecafArtifact).toStrictEqual({ id: 10, type: 'CCY' });
  });
});
