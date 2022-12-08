import { Case, Diagnosis, DiseaseFilter } from '../core/diseaseFilter';

describe('Disease filter', () => {
	it('filters cases when several diagnosis filters are applied together', () => {
		const searchCriterion1 = 'Cerebro';
		const searchCriterion2 = 'Vías Respiratorias Altas';
		const discardedLocation = 'irrelevant';
		const diagnoses = [
			createDiagnosisFrom({ id: 2 }, { location: searchCriterion1 }),
			createDiagnosisFrom({ id: 1 }, { location: searchCriterion2 }),
			createDiagnosisFrom({ id: 3 }, { location: discardedLocation }),
		];
		const cases = [
			createCasesFrom({ diagnosisId: 1 }, { patientName: 'Chupito' }),
			createCasesFrom({ diagnosisId: 2 }, { patientName: 'Juliana' }),
			createCasesFrom({ diagnosisId: 3 }, { patientName: 'otro' }),
		];
		const diseaseFilter = DiseaseFilter.create(cases, diagnoses);
		diseaseFilter.addFilter(searchCriterion1);
		diseaseFilter.addFilter(searchCriterion2);

		const result = diseaseFilter.casesFiltered;

		expect(result.length).toBe(2);
		expect(result[1].patientName).toBe('Chupito');
		expect(result[0].patientName).toBe('Juliana');
	});
});

function createDiagnosisFrom(...options: Partial<Diagnosis>[]): Diagnosis {
	const defaults = {
		name: 'Irrelevant-name',
		system: 'Irrelevant-system',
		origin: 'Irrelevant-origin',
		specie: 'Irrelevant-specie',
	};

	return Object.assign({}, defaults, ...options);
}

function createDiagnosis(id: number, location: string): Diagnosis {
	return {
		id: id,
		location: location,
		name: 'Irrelevant-name',
		system: 'Irrelevant-system',
		origin: 'Irrelevant-origin',
		specie: 'Irrelevant-specie',
	};
}

function createCasesFrom(...options: Partial<Case>[]): Case {
	const defaults = {
		id: 0,
		diagnosisName: 'irrelevant-diagnosisName',
		publicNotes: [],
		privateNotes: [],
	} as Case;

	return Object.assign({}, defaults, ...options);
}

function createCase(diagnosisId: number, patientName: string): Case {
	return {
		diagnosisId: diagnosisId,
		patientName: patientName,
		id: 0,
		diagnosisName: 'irrelevant-diagnosisName',
		publicNotes: [],
		privateNotes: [],
	};
}
