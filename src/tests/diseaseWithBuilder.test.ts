import { Case, Diagnosis, DiseaseFilter } from '../core/diseaseFilter';

describe('Disease filter', () => {
	it('filters cases when several diagnosis filters are applied together', () => {
		const searchCriterion1 = 'Cerebro';
		const searchCriterion2 = 'Vías Respiratorias Altas';
		const discardedLocation = 'irrelevant';
		const fixtures = casesWithDiagnoses()
			.havingDiagnosisWithLocationAndCaseWithName(searchCriterion2, 'Chupito')
			.havingDiagnosisWithLocationAndCaseWithName(searchCriterion1, 'Juliana')
			.havingDiagnosisWithLocationAndCaseWithName(discardedLocation, 'otro')
			.build();

		const diseaseFilter = DiseaseFilter.create(fixtures.cases(), fixtures.diagnoses());
		diseaseFilter.addFilter(searchCriterion1);
		diseaseFilter.addFilter(searchCriterion2);

		const result = diseaseFilter.casesFiltered;

		expect(result.length).toBe(2);
		expect(result[1].patientName).toBe('Chupito');
		expect(result[0].patientName).toBe('Juliana');
	});
});

function casesWithDiagnoses() {
	let id = 0;
	const theDiagnoses = [];
	const theCases = [];

	const add = (location: string, patientName: string) => {
		++id;
		const aDiagnosis = createDiagnosisFrom(id, location);
		const aCase = createCasesFrom(aDiagnosis, patientName, id);
		theDiagnoses.push(aDiagnosis);
		theCases.push(aCase);
	};

	const builder = {
		havingDiagnosisWithLocationAndCaseWithName: (locationName: string, patientName: string) => {
			add(locationName, patientName);
			return builder;
		},
		build: () => ({
			cases: () => theCases,
			diagnoses: () => theDiagnoses,
		}),
	};

	return builder;
}

function createDiagnosisFrom(id: number, location: string): Diagnosis {
	return {
		id: id,
		location: location,
		name: 'Irrelevant-name',
		system: 'Irrelevant-system',
		origin: 'Irrelevant-origin',
		specie: 'Irrelevant-specie',
	};
}

function createCasesFrom(diagnosis: Diagnosis, patientName: string, id = 0): Case {
	return {
		id: id,
		patientName: patientName,
		diagnosisId: diagnosis.id,
		diagnosisName: diagnosis.name,
		publicNotes: [],
		privateNotes: [],
	};
}
