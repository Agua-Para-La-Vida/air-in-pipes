"use client";
import { useEffect, useRef, useState } from "react";
import {
  setLibrary,
  togglePipeAvailability,
  setProject,
} from "../../redux/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { ProjectState } from "../../redux/store";
import { PipeData } from "./tube_list";
import { useProjectLoader } from "../../reload_fetch";

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TubeData() {
  const dispatch = useDispatch();
  const pipeData = useSelector(
    (state: ProjectState) => state.project.library.pipe_data
  );
  const cost = useSelector(
    (state: ProjectState) => state.project.library.valve_cost
  );
  const t = useTranslations("pipes");

  useProjectLoader((proj) => dispatch(setProject(proj)));
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [selectedPipe, setSelectedPipe] = useState<PipeData[]>([]);
  const [newPipeId, setNewPipeId] = useState("");
  const [newPipeSize, setNewPipeSize] = useState("");
  const [newPipeSdr, setNewPipeSdr] = useState("");
  const [newPipeCost, setNewPipeCost] = useState("");

  useEffect(() => {
    const allAvailable = pipeData.every((pipe: PipeData) => pipe.available);
    const someAvailable = pipeData.some((pipe: PipeData) => pipe.available);
    setChecked(allAvailable);
    setIndeterminate(!allAvailable && someAvailable);
    if (checkbox.current) {
      checkbox.current.indeterminate = !allAvailable && someAvailable;
    }

    dispatch(setLibrary({ data: pipeData, valveCost: cost }));
  }, [pipeData, cost, dispatch]);

  function toggleAll() {
    if (checked || indeterminate) {
      dispatch(
        setLibrary({
          data: pipeData.map((pipe: PipeData) => ({
            ...pipe,
            available: false,
          })),
          valveCost: cost,
        })
      );
    } else {
      dispatch(
        setLibrary({
          data: pipeData.map((pipe: PipeData) => ({
            ...pipe,
            available: true,
          })),
          valveCost: cost,
        })
      );
    }
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function handleCheckboxClick(pipe: PipeData, isChecked: boolean) {
    dispatch(togglePipeAvailability({ pipeId: pipe.id, isChecked: isChecked }));
    const updatedPipeData = pipeData.map((p: PipeData) =>
      p.id === pipe.id ? { ...p, available: isChecked } : p
    );
    const allAvailable = updatedPipeData.every((p: PipeData) => p.available);
    const someAvailable = updatedPipeData.some((p: PipeData) => p.available);

    setChecked(allAvailable);
    setIndeterminate(!allAvailable && someAvailable);
    if (checkbox.current) {
      checkbox.current.indeterminate = !allAvailable && someAvailable;
    }
  }

  function handleAddPipe() {
    if (!newPipeId || !newPipeSize || !newPipeSdr || !newPipeCost) return;
    const newPipe: PipeData = {
      id: parseFloat(newPipeId),
      nominal_size: newPipeSize,
      sdr: parseFloat(newPipeSdr),
      cost: parseFloat(newPipeCost),
      available: true,
    };

    dispatch(setLibrary({ data: [...pipeData, newPipe], valveCost: cost }));
    setNewPipeSize("");
    setNewPipeSdr("");
    setNewPipeCost("");
  }

  return (
    <div className="mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {t("pipe-data")}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {t("list")}
            </p>
          </div>

          <div className="flex flex-row items-center gap-3 ">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium font-italicize  text-gray-700"
            >
              {t("valve-cost")}
            </label>
            <div className="flex-shrink-0">
              <input
                type="text"
                name="project-name"
                id="project-name"
                value={cost}
                onChange={(e) =>
                  dispatch(
                    setLibrary({
                      data: pipeData,
                      valveCost: Number(e.target.value),
                    })
                  )
                }
                className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder={t("nominal-size")}
            value={newPipeSize}
            onChange={(e) => setNewPipeSize(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
          <input
            type="text"
            placeholder={t("sdr")}
            value={newPipeSdr}
            onChange={(e) => setNewPipeSdr(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
          <input
            type="number"
            placeholder={t("id")}
            value={newPipeId}
            onChange={(e) => setNewPipeId(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
          <input
            type="number"
            placeholder={t("cost")}
            value={newPipeCost}
            onChange={(e) => setNewPipeCost(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
          />
          <button
            onClick={handleAddPipe}
            className="rounded-md bg-sky-500 px-3 py-1 text-l font-semibold text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-inset focus:ring-sky-600"
          >
            {t("add")}
          </button>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2  h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            ref={checkbox}
                            checked={checked}
                            onChange={toggleAll}
                          />
                          <span className="px-4 text-sm font-semibold text-gray-900">
                            {t("available")}
                          </span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("nominal-size")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("sdr")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("id")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("cost")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pipeData.map((pipe: PipeData) => (
                      <tr
                        key={pipe.id}
                        className={
                          selectedPipe.includes(pipe) ? "bg-gray-50" : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPipe.includes(pipe) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                            value={pipe.id}
                            checked={pipe.available}
                            onChange={(e) =>
                              handleCheckboxClick(pipe, e.target.checked)
                            }
                          />
                        </td>

                        <td
                          className={classNames(
                            "whitespace-nowrap py-4 px-3 text-sm font-medium",
                            selectedPipe.includes(pipe)
                              ? "text-indigo-600"
                              : "text-gray-900"
                          )}
                        >
                          {pipe.nominal_size}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.sdr}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {pipe.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
