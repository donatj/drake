// Copyright 2023 Jesse G. Donat

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const drake = (R: number, fp: number, ne: number, fl: number, fi: number, fc: number, L: number) => R * fp * ne * fl * fi * fc * L;

class DrakeMaker {
	public constructor(
		private R: HTMLInputElement,
		private fp: HTMLInputElement,
		private ne: HTMLInputElement,
		private fl: HTMLInputElement,
		private fi: HTMLInputElement,
		private fc: HTMLInputElement,
		private L: HTMLInputElement,
		private N: HTMLInputElement
	) {
		const inputs = this.inputs();

		const change = () => {
			let valid = true;
			for (const i of inputs) {
				if (!i.checkValidity()) {
					valid = false;
					i.classList.add("is-invalid");
				} else {
					i.classList.remove("is-invalid");
				}
			}

			if (!valid) {
				return;
			}

			this.drakeItUp();
		}

		for (const i of inputs) {
			if (i.type === "number" && i.min !== "" && i.max !== "" && i.step !== "") {
				createLinkedRangeInput(i);
			}

			i.addEventListener("input", change);
		}

		this.drakeItUp();
	}

	private inputs(): HTMLInputElement[] {
		return [
			this.R,
			this.fp,
			this.ne,
			this.fl,
			this.fi,
			this.fc,
			this.L
		];
	}

	private drakeItUp() {
		const N = drake(
			parseFloat(this.R.value),
			parseFloat(this.fp.value),
			parseFloat(this.ne.value),
			parseFloat(this.fl.value),
			parseFloat(this.fi.value),
			parseFloat(this.fc.value),
			parseFloat(this.L.value)
		);

		this.N.title = String(N);
		this.N.value = N.toFixed(6);
	}
}

function createLinkedRangeInput(i: HTMLInputElement): HTMLInputElement {
	const rng = document.createElement("input");
	rng.type = "range";
	rng.min = i.min;
	rng.max = i.max;
	rng.step = i.step;
	rng.value = i.value;
	rng.style.display = 'block';
	i.parentElement!.insertBefore(rng, i.nextSibling);

	rng.addEventListener("input", () => {
		if (rng.value === i.value) { // prevent infinite loop
			return;
		}

		i.value = rng.value;
		i.dispatchEvent(new Event("input"));
	});
	i.addEventListener("input", () => {
		rng.value = i.value;
	});

	return rng;
}