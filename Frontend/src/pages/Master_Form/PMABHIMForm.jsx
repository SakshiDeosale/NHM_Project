import { useEffect, useMemo, useState } from "react";
import API_URL, { apiFetch } from "../../utils/api";

import { useNavigate } from "react-router-dom";
import SuccessModal from "./SuccessModal";


const initial = {

    srNo: "",

    workId: "",

    district: "",

    fmrCode: "",

    nameOfWork: "",

    yearOfApproval: "",

    projectCost: "",

    aaDate: "",

    aaAmount: "",

    eeName: "",

    eeContact: "",

    deName: "",

    deContact: "",

    jeName: "",

    jeContact: "",

    mlaName: "",

    mlaConstituency: "",

    mpName: "",

    mpConstituency: "",

    circle: "",

    civilTsDate: "",

    civilTsAmount: "",

    civilWoDate: "",

    civilWoAmount: "",

    architect: "",

    architectWoDate: "",

    architectContact: "",

    feesPercent: "",

    feesPaid: "",

    contractorName: "",

    contractorContact: "",

    civilTenderPercent: "",

    civilTenderType: "Above",

    civilExpenditure: "",

    electricalContractor: "",

    electricalContact: "",

    electricalTsDate: "",

    electricalTsAmount: "",

    electricalWoDate: "",

    electricalWoAmount: "",

    electricalTenderPercent: "",

    electricalTenderType: "Above",

    electricalExpenditure: "",

    electricalStatus: "Not Started",

    mgpsContractor: "",

    mgpsContact: "",

    mgpsTsDate: "",

    mgpsTsAmount: "",

    mgpsWoDate: "",

    mgpsWoAmount: "",

    mgpsTenderPercent: "",

    mgpsTenderType: "Above",

    mgpsExpenditure: "",

    mgpsStatus: "Not Started",

    furnitureContractor: "",

    furnitureContact: "",

    furnitureTsDate: "",

    furnitureTsAmount: "",

    furnitureWoDate: "",

    furnitureWoAmount: "",

    furnitureTenderPercent: "",

    furnitureTenderType: "Above",

    furnitureExpenditure: "",

    furnitureStatus: "Not Started",

    waterSupplyStatus: "Not Started",

    transformerStatus: "Not Started",

    fireFightingStatus: "Not Started",

    stpEtpStatus: "Not Started",

    liftStatus: "Not Started",

    hvacStatus: "Not Started",

    otherExpenditure: "",

    actualStatus: "Not Started",

    remarks: "",

};

const n = (v) => Number(v || 0);

const money = (v) =>

    n(v).toLocaleString("en-IN", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2,

    });

// Validation function for Work ID

const validateWorkId = (workId) => {

    const value = String(workId ?? "").trim();

    if (!value) {

        return "Work ID is required.";

    }

    if (!/^\d+$/.test(value)) {

        return "Work ID must contain digits only.";

    }

    if (/^0+$/.test(value)) {

        return "Work ID must be greater than zero.";

    }

    return "";

};

export default function ADBForm() {

    // success modal state

    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    const [form, setForm] = useState(initial);

    const [message, setMessage] = useState("");
    const [circles, setCircles] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [engineeringUsers, setEngineeringUsers] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(false);

    // MLA data fetched from SQL Server

    const [mlaNames, setMlaNames] = useState([]);

    const [mpNames, setMpNames] = useState([]);

    const selectedScheme = { api: "pm-abhim", title: "PM-ABHIM" };
    const schemeApiUrl = `${API_URL}/forms`;
    const schemeQuery = `?scheme=${encodeURIComponent(selectedScheme.api)}`;

    const selectedCircle = circles.find(
        (circle) =>
            String(circle.CircleName).trim().toLowerCase() ===
            String(form.circle).trim().toLowerCase()
    );

    const filteredDistricts = districtOptions.filter(
        (district) =>
            String(district.CircleID) === String(selectedCircle?.CircleID)
    );

    const eeUsers = engineeringUsers.filter(
        (user) =>
            String(user.Designation).trim().toLowerCase() === "executive engineer" &&
            String(user.Circle || "").trim().toLowerCase() ===
            String(form.circle).trim().toLowerCase()
    );

    const deUsers = engineeringUsers.filter(
        (user) =>
            String(user.Designation).trim().toLowerCase() === "deputy engineer" &&
            String(user.Circle || "").trim().toLowerCase() ===
            String(form.circle).trim().toLowerCase() &&
            String(user.District || "").trim().toLowerCase() ===
            String(form.district).trim().toLowerCase()
    );

    const jeUsers = engineeringUsers.filter(
        (user) =>
            String(user.Designation).trim().toLowerCase() === "junior engineer" &&
            String(user.Circle || "").trim().toLowerCase() ===
            String(form.circle).trim().toLowerCase() &&
            String(user.District || "").trim().toLowerCase() ===
            String(form.district).trim().toLowerCase()
    );


    useEffect(() => {
        const loadDropdownData = async () => {
            setLoadingDropdowns(true);

            try {
                const [circleRes, districtRes, usersRes] = await Promise.all([
                    apiFetch("http://${API_URL}/api/circles"),
                    apiFetch("http://${API_URL}/api/districts"),
                    apiFetch("http://${API_URL}/api/users"),
                ]);

                if (!circleRes.ok || !districtRes.ok || !usersRes.ok) {
                    throw new Error("Unable to load Circle, District, or Engineer data.");
                }

                const [circleData, districtData, usersData] = await Promise.all([
                    circleRes.json(),
                    districtRes.json(),
                    usersRes.json(),
                ]);

                setCircles(Array.isArray(circleData) ? circleData : []);
                setDistrictOptions(Array.isArray(districtData) ? districtData : []);

                setEngineeringUsers(
                    (Array.isArray(usersData) ? usersData : []).filter((user) => {
                        const designation = String(user.Designation || "").trim().toLowerCase();

                        return [
                            "executive engineer",
                            "deputy engineer",
                            "junior engineer",
                        ].includes(designation) && (
                                user.IsActive === true ||
                                user.IsActive === 1 ||
                                user.IsActive === "1"
                            );
                    })
                );
            } catch (error) {
                console.error("Dropdown data loading error:", error);
                setMessage(error.message || "Unable to load dropdown data.");
            } finally {
                setLoadingDropdowns(false);
            }
        };

        loadDropdownData();
    }, []);


    useEffect(() => {

        apiFetch(`${API_URL}/mlamps`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load MLA/MP records");
                return res.json();
            })
            .then((data) => {
                // This project's master table uses Amdar/Khasdar as MemberType.
                // Constituency is not returned by the current /api/mlamps endpoint.
                const activeMembers = Array.isArray(data) ? data : [];
                setMlaNames(activeMembers
                    .filter((member) => ["Amdar", "MLA"].includes(member.MemberType))
                    .map((member) => ({
                        MLA_Name: member.MemberName,
                        MLA_Constituency: member.Constituency || "",
                    })));
                setMpNames(activeMembers
                    .filter((member) => ["Khasdar", "MP"].includes(member.MemberType))
                    .map((member) => ({
                        MP_Name: member.MemberName,
                        MP_Constituency: member.Constituency || "",
                    })));
            })
            .catch((err) => console.error("MLA/MP fetch error:", err));

    }, []);

    const set = (key, value) => {

        setForm((p) => ({ ...p, [key]: value }));

        setMessage("");

    };

    // Auto-generate Sr. No. on component mount

    useEffect(() => {

        const fetchNextSrNo = async () => {

            try {

                const response = await apiFetch(

                    `${schemeApiUrl}/next-sr-no${schemeQuery}`,

                );

                if (!response.ok) {

                    throw new Error("Failed to fetch Sr. No.");

                }

                const data = await response.json();

                set("srNo", String(data.srNo));

            } catch (error) {

                console.error("Sr. No. error:", error);

            }

        };

        fetchNextSrNo();

    }, [schemeApiUrl]);

    // Contractor names fetched from SQL Server

    const [contractors, setContractors] = useState([]);

    useEffect(() => {

        const fetchContractors = async () => {

            try {

                const response = await apiFetch(`${API_URL}/contractors`);

                if (!response.ok) {

                    throw new Error("Failed to fetch contractors");

                }

                const data = await response.json();

                setContractors(data);

            } catch (error) {

                console.error("Contractor fetch error:", error);

            }

        };

        fetchContractors();

    }, []);

    // Calculate project metrics

    const calc = useMemo(() => {

        const totalFees = (n(form.projectCost) * n(form.feesPercent)) / 100;

        const balanceFees = Math.max(0, totalFees - n(form.feesPaid));

        const totalExpenditure =

            n(form.civilExpenditure) +

            n(form.electricalExpenditure) +

            n(form.mgpsExpenditure) +

            n(form.furnitureExpenditure) +

            n(form.otherExpenditure);

        const balanceAmount = Math.max(0, n(form.projectCost) - totalExpenditure);

        const completion = n(form.projectCost)

            ? Math.min(100, (totalExpenditure / n(form.projectCost)) * 100)

            : 0;

        const statuses = [

            form.electricalStatus,

            form.mgpsStatus,

            form.furnitureStatus,

            form.waterSupplyStatus,

            form.transformerStatus,

            form.fireFightingStatus,

            form.stpEtpStatus,

            form.liftStatus,

            form.hvacStatus,

        ];

        return {

            totalFees,

            balanceFees,

            totalExpenditure,

            balanceAmount,

            completion,

            complete: statuses.filter((x) => x === "Completed").length,

            progress: statuses.filter((x) => x === "In Progress").length,

            notStarted: statuses.filter((x) => x === "Not Started").length,

            cancelled: statuses.filter((x) => x === "Cancelled").length,

            total: statuses.length,

        };

    }, [form]);

    const save = async () => {

        // Validate Work ID before proceeding

        const workIdError = validateWorkId(form.workId);

        if (workIdError) {

            setMessage(workIdError);

            return;

        }

        try {

            setMessage("Saving project...");

            const response = await apiFetch(`${schemeApiUrl}${schemeQuery}`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify(form),

            });

            const result = await response.json();

            if (!response.ok) {

                throw new Error(result.message || "Failed to save project");

            }

            setShowSuccess(true);

        } catch (error) {

            console.error("Save error:", error);

            setMessage(`Save failed: ${error.message}`);

        }

    };

    const reset = () => {

        setForm(initial);

        setMessage("");

    };

    return (

        <>
            <div className="app nhm-form-theme">
                <main className="main">
                    <div className="page">
                        <div className="pagebar">

                            <div>

                                <h1>{selectedScheme.title}</h1>

                                <small>Master Form</small>

                            </div>

                        </div>

                        {/* {message && <div className="message">{message}</div>} */}

                        {/* error message */}

                        {message && (

                            <div className="message error-message" role="alert">

                                {message}

                            </div>

                        )}

                        <form

                            onSubmit={(e) => {

                                e.preventDefault();

                                save("save");

                            }}

                        >

                            <Section no="1" title="Project Basic Information" color="blue">

                                <div className="row four">

                                    <Field label="Sr. No." required>

                                        <input

                                            type="text"

                                            value={form.srNo || ""}

                                            placeholder="Loading"

                                            readOnly

                                        />

                                    </Field>

                                    <Field label="Work Id" required>

                                        <input

                                            type="text"

                                            name="workId"

                                            inputMode="numeric"

                                            value={form.workId}

                                            onChange={(e) => {

                                                const value = e.target.value;

                                                if (/^\d*$/.test(value)) {

                                                    set("workId", value);

                                                }

                                            }}

                                            placeholder="Enter Work ID"

                                            required

                                        />

                                    </Field>


                                    <Field label="Circle" required>
                                        <select
                                            value={form.circle}
                                            onChange={(e) => {
                                                set("circle", e.target.value);
                                                set("district", "");
                                                set("deName", "");
                                                set("jeName", "");
                                            }}
                                            required
                                            disabled={loadingDropdowns}
                                        >
                                            <option value="">
                                                {loadingDropdowns ? "Loading circles..." : "Select Circle"}
                                            </option>

                                            {circles.map((circle) => (
                                                <option key={circle.CircleID} value={circle.CircleName}>
                                                    {circle.CircleName}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="District" required>
                                        <select
                                            value={form.district}
                                            onChange={(e) => {
                                                set("district", e.target.value);
                                                set("deName", "");
                                                set("jeName", "");
                                            }}
                                            required
                                            disabled={!form.circle || loadingDropdowns}
                                        >
                                            <option value="">
                                                {!form.circle
                                                    ? "Select Circle First"
                                                    : "Select District"}
                                            </option>

                                            {filteredDistricts.map((district) => (
                                                <option key={district.DistrictID} value={district.DistrictName}>
                                                    {district.DistrictName}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>


                                    <Field label="Year of Approval" required>

                                        <select

                                            value={form.yearOfApproval}

                                            onChange={(e) => set("yearOfApproval", e.target.value)}

                                        >

                                            <option key="year-placeholder" value="">Select Year</option>

                                            {Array.from({ length: 27 }, (_, i) => {

                                                const startYear = 2000 + i;

                                                const endYear = startYear + 1;

                                                return (

                                                    <option

                                                        key={startYear}

                                                        value={`${startYear}-${endYear}`}

                                                    >

                                                        {startYear} - {endYear}

                                                    </option>

                                                );

                                            })}

                                            ;

                                        </select>

                                    </Field>

                                </div>

                                <div className="row four">

                                    <Field label="Project Cost (Rs. Lakhs)" required>

                                        <input

                                            type="number"

                                            min="0"

                                            value={form.projectCost}

                                            onChange={(e) => set("projectCost", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="FMR Code" required>

                                        <input

                                            value={form.fmrCode}

                                            onChange={(e) => set("fmrCode", e.target.value)}

                                            required

                                        />

                                    </Field>

                                    <Field label="AA Date">

                                        <input

                                            type="date"

                                            value={form.aaDate}

                                            onChange={(e) => set("aaDate", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="AA Amount (Rs. Lakhs)">

                                        <input

                                            type="number"

                                            min="0"

                                            value={form.aaAmount}

                                            onChange={(e) => set("aaAmount", e.target.value)}

                                        />

                                    </Field>

                                </div>

                                <Field label="Name of Work" required>

                                    <textarea

                                        rows="2"

                                        value={form.nameOfWork}

                                        onChange={(e) => set("nameOfWork", e.target.value)}

                                    />

                                </Field>

                                <div className="row six">

                                    {/* Dropdown for EE Name */}

                                    <Field label="EE Name" required>

                                        <select

                                            value={form.eeName}

                                            onChange={(e) => set("eeName", e.target.value)}

                                        >

                                            <option key="ee-placeholder" value="">Select EE Name</option>

                                            {eeUsers.map((user) => {
                                                const name = [
                                                    user.FirstName,
                                                    user.MiddleName,
                                                    user.Surname,
                                                ].filter(Boolean).join(" ");

                                                return (
                                                    <option key={user.UserID} value={name}>
                                                        {name}
                                                    </option>
                                                );
                                            })}

                                        </select>

                                    </Field>

                                    <Field label="Contact No.(EE)">

                                        <input

                                            value={form.eeContact}

                                            onChange={(e) => set("eeContact", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="DE Name" required>

                                        <select

                                            value={form.deName}

                                            onChange={(e) => set("deName", e.target.value)}

                                        >

                                            <option key="de-placeholder" value="">Select DE Name</option>

                                            {deUsers.map((user) => {
                                                const name = [
                                                    user.FirstName,
                                                    user.MiddleName,
                                                    user.Surname,
                                                ].filter(Boolean).join(" ");

                                                return (
                                                    <option key={user.UserID} value={name}>
                                                        {name}
                                                    </option>
                                                );
                                            })}

                                        </select>

                                    </Field>

                                    <Field label="Contact No.(DE)">

                                        <input

                                            value={form.deContact}

                                            onChange={(e) => set("deContact", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="JE Name" required>

                                        <select

                                            value={form.jeName}

                                            onChange={(e) => set("jeName", e.target.value)}

                                        >

                                            <option key="je-placeholder" value="">Select JE Name</option>

                                            {jeUsers.map((user) => {
                                                const name = [
                                                    user.FirstName,
                                                    user.MiddleName,
                                                    user.Surname,
                                                ].filter(Boolean).join(" ");

                                                return (
                                                    <option key={user.UserID} value={name}>
                                                        {name}
                                                    </option>
                                                );
                                            })}

                                        </select>

                                    </Field>

                                    <Field label="Contact No.(JE)">

                                        <input

                                            value={form.jeContact}

                                            onChange={(e) => set("jeContact", e.target.value)}

                                        />

                                    </Field>

                                </div>

                                <div className="row six">

                                    <Field label="MLA Name" required>

                                        <select

                                            value={form.mlaName}

                                            onChange={(e) => {

                                                const selected = mlaNames.find(

                                                    (mla) => mla.MLA_Name === e.target.value,

                                                );

                                                set("mlaName", selected?.MLA_Name || "");

                                                set(

                                                    "mlaConstituency",

                                                    selected?.MLA_Constituency || "",

                                                );

                                            }}

                                            required

                                        >

                                            <option key="mla-placeholder" value="">Select MLA</option>

                                            {/* KEY */}

                                            {mlaNames.map((mla, index) => (

                                                <option

                                                    key={`${mla.MLA_Name}-${mla.MLA_Constituency}-${index}`}

                                                    value={mla.MLA_Name}

                                                >

                                                    {mla.MLA_Name}

                                                </option>

                                            ))}

                                        </select>

                                    </Field>

                                    <Field label="MLA Constituency" disabled>

                                        <input

                                            value={form.mlaConstituency}

                                            placeholder="Auto-filled from MLA selection"

                                            readOnly

                                            required

                                        />

                                    </Field>

                                    <Field label="MP Name" required>

                                        <select

                                            value={form.mpName}

                                            onChange={(e) => {

                                                const selected = mpNames.find(

                                                    (mp) => mp.MP_Name === e.target.value,

                                                );

                                                set("mpName", selected?.MP_Name || "");

                                                set("mpConstituency", selected?.MP_Constituency || "");

                                            }}

                                            required

                                        >

                                            <option key="mp-placeholder" value="">Select MP</option>

                                            {mpNames.map((mp, index) => (

                                                <option

                                                    key={`${mp.MP_Name}-${mp.MP_Constituency}-${index}`}

                                                    value={mp.MP_Name}

                                                >

                                                    {mp.MP_Name}

                                                </option>

                                            ))}

                                        </select>

                                    </Field>

                                    <Field label="MP Constituency" disabled>

                                        <input

                                            value={form.mpConstituency}

                                            placeholder="Auto-filled from MP selection"

                                            readOnly

                                            required

                                        />

                                    </Field>

                                </div>

                            </Section>

                            <Section no="2" title="Civil Work Details" color="green">

                                <div className="row four">

                                    <Field label="Civil TS Date">

                                        <input

                                            type="date"

                                            value={form.civilTsDate}

                                            onChange={(e) => set("civilTsDate", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="Civil TS Amount (Rs. Lakhs)">

                                        <input

                                            type="number"

                                            value={form.civilTsAmount}

                                            onChange={(e) => set("civilTsAmount", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="Civil WO Date">

                                        <input

                                            type="date"

                                            value={form.civilWoDate}

                                            onChange={(e) => set("civilWoDate", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="Civil WO Amount (Rs. Lakhs)">

                                        <input

                                            type="number"

                                            value={form.civilWoAmount}

                                            onChange={(e) => set("civilWoAmount", e.target.value)}

                                        />

                                    </Field>

                                </div>

                                <div className="row four">

                                    <Field label="Name of Architect" required>

                                        <input

                                            value={form.architect}

                                            onChange={(e) => set("architect", e.target.value)}

                                            required

                                        />

                                    </Field>

                                    <Field label="Architect WO Date">

                                        <input

                                            type="date"

                                            value={form.architectWoDate}

                                            onChange={(e) => set("architectWoDate", e.target.value)}

                                        />

                                    </Field>

                                    <Field label="Contact No. (Architect)">

                                        <input

                                            maxLength="10"

                                            value={form.architectContact}

                                            onChange={(e) =>

                                                set(

                                                    "architectContact",

                                                    e.target.value.replace(/\D/g, ""),

                                                )

                                            }

                                        />

                                    </Field>

                                    <Field label="Fees % (Including GST)">

                                        <input

                                            type="number"

                                            step="0.01"

                                            value={form.feesPercent}

                                            onChange={(e) => set("feesPercent", e.target.value)}

                                        />

                                    </Field>

                                </div>

                                <div className="row three auto-box">

                                    <ReadOnly

                                        label="Total Fees Payable (Rs.)"

                                        value={`₹ ${money(calc.totalFees)}`}

                                    />

                                    <Field label="Fees Paid (Rs.)">

                                        <input

                                            type="number"

                                            value={form.feesPaid}

                                            onChange={(e) => set("feesPaid", e.target.value)}

                                        />

                                    </Field>

                                    <ReadOnly

                                        label="Balance Fees (Rs.)"

                                        value={`₹ ${money(calc.balanceFees)}`}

                                    />

                                </div>

                                <div className="row four">

                                    <Field label="Contractor Name" required>

                                        <select

                                            value={form.contractorName || ""}

                                            onChange={(e) => set("contractorName", e.target.value)}

                                            required

                                        >

                                            <option key="contractor-placeholder" value="">Select Contractor</option>

                                            {contractors.map((contractor, index) => (

                                                <option

                                                    key={`${contractor.ContractorName}-${index}`}

                                                    value={contractor.ContractorName}

                                                >

                                                    {contractor.ContractorName}

                                                </option>

                                            ))}

                                        </select>

                                    </Field>

                                    <Field label="Contact No. (Contractor)">

                                        <input

                                            maxLength="10"

                                            value={form.contractorContact}

                                            onChange={(e) =>

                                                set(

                                                    "contractorContact",

                                                    e.target.value.replace(/\D/g, ""),

                                                )

                                            }

                                        />

                                    </Field>

                                    <TenderField

                                        label="Civil % Above/Below Tender"

                                        percent={form.civilTenderPercent}

                                        type={form.civilTenderType}

                                        setPercent={(v) => set("civilTenderPercent", v)}

                                        setType={(v) => set("civilTenderType", v)}

                                    />

                                    <Field label="Civil Expenditure (Rs. Lakhs)">

                                        <input

                                            type="number"

                                            value={form.civilExpenditure}

                                            onChange={(e) => set("civilExpenditure", e.target.value)}

                                        />

                                    </Field>

                                </div>

                            </Section>

                            <WorkSection

                                no="3"

                                title="Electrical Work Details"

                                color="purple"

                                p="electrical"

                                label="Electrical"

                                form={form}

                                set={set}

                            />

                            <WorkSection

                                no="4"

                                title="MGPS Work Details"

                                color="yellow"

                                p="mgps"

                                label="MGPS"

                                form={form}

                                set={set}

                            />

                            <WorkSection

                                no="5"

                                title="Furniture Work Details"

                                color="pink"

                                p="furniture"

                                label="Furniture"

                                form={form}

                                set={set}

                            />

                            <Section no="6" title="Other Work Status" color="cyan">

                                <div className="row seven">

                                    <StatusField

                                        label="Water Supply Status"

                                        value={form.waterSupplyStatus}

                                        onChange={(v) => set("waterSupplyStatus", v)}

                                        required

                                    />

                                    <StatusField

                                        label="Transformer Substation Status"

                                        value={form.transformerStatus}

                                        onChange={(v) => set("transformerStatus", v)}

                                        required

                                    />

                                    <StatusField

                                        label="Fire Fighting Status"

                                        value={form.fireFightingStatus}

                                        onChange={(v) => set("fireFightingStatus", v)}

                                        required

                                    />

                                    <StatusField

                                        label="STP & ETP Status"

                                        value={form.stpEtpStatus}

                                        onChange={(v) => set("stpEtpStatus", v)}

                                        required

                                    />

                                    <StatusField

                                        label="Lift & Elevators"

                                        value={form.liftStatus}

                                        onChange={(v) => set("liftStatus", v)}

                                        required

                                    />

                                    <StatusField

                                        label="HVAC"

                                        value={form.hvacStatus}

                                        onChange={(v) => set("hvacStatus", v)}

                                        required

                                    />

                                    <Field label="Expenditure of Other Work (Rs. Lakhs)" required>

                                        <input

                                            type="number"

                                            min="0"

                                            value={form.otherExpenditure}

                                            onChange={(e) => set("otherExpenditure", e.target.value)}

                                            required

                                        />

                                    </Field>

                                </div>

                            </Section>

                            <Section no="7" title="Project Summary & Status" color="pink">

                                <div className="summary">

                                    <div className="card">

                                        <h3>Expenditure Details (Rs. Lakhs)</h3>

                                        <Summary

                                            label="Civil Expenditure"

                                            value={money(form.civilExpenditure)}

                                        />

                                        <Summary

                                            label="Electrical Expenditure"

                                            value={money(form.electricalExpenditure)}

                                        />

                                        <Summary

                                            label="MGPS Expenditure"

                                            value={money(form.mgpsExpenditure)}

                                        />

                                        <Summary

                                            label="Furniture Expenditure"

                                            value={money(form.furnitureExpenditure)}

                                        />

                                        <Summary

                                            label="Other Work Expenditure"

                                            value={money(form.otherExpenditure)}

                                        />

                                        <Summary

                                            label="Total Expenditure (23+31+39+48+56)"

                                            value={money(calc.totalExpenditure)}

                                            total

                                        />

                                    </div>

                                    <div className="card">

                                        <h3>Work Progress Count</h3>

                                        <Summary label="Complete" value={calc.complete} />

                                        <Summary label="Progress" value={calc.progress} />

                                        <Summary label="Not Started" value={calc.notStarted} />

                                        <Summary label="Cancelled" value={calc.cancelled} />

                                        <Summary label="Total" value={calc.total} total />

                                        <Summary

                                            label="% Completion of Work"

                                            value={`${calc.completion.toFixed(2)}%`}

                                            total

                                        />

                                    </div>

                                    <div className="card">

                                        <h3>Project Financial & Progress</h3>

                                        <Summary

                                            label="Project Cost (Rs. Lakhs)"

                                            value={money(form.projectCost)}

                                        />

                                        <Summary

                                            label="Total Expenditure (Rs. Lakhs)"

                                            value={money(calc.totalExpenditure)}

                                        />

                                        <Summary

                                            label="Balance Amount (Rs. Lakhs)"

                                            value={money(calc.balanceAmount)}

                                        />

                                        <div className="progress-head">

                                            <span>Completion %</span>

                                            <b>{calc.completion.toFixed(1)}%</b>

                                        </div>

                                        <div className="progress">

                                            <span style={{ width: `${calc.completion}%` }} />

                                        </div>

                                        <StatusField

                                            label="Actual Status of Work"

                                            value={form.actualStatus}

                                            onChange={(v) => set("actualStatus", v)}
                                            required

                                        />

                                    </div>

                                    <div className="card remarks">

                                        <h3>Additional Remarks (NABARD)</h3>

                                        <label>

                                            Additional Remarks for completion of Project under NABARD

                                            (Rs. Lakhs)

                                        </label>

                                        <textarea

                                            rows="8"

                                            value={form.remarks}

                                            onChange={(e) => set("remarks", e.target.value)}

                                        />

                                    </div>

                                </div>

                            </Section>

                            <div className="bottom">

                                <button className="save" type="submit">

                                    ▣ Save

                                </button>

                                {/* <button

                className="update"

                type="button"

                onClick={() => save("update")}

              >

                ✓ Update

              </button> */}

                                <button className="reset" type="button" onClick={reset}>

                                    ↻ Reset

                                </button>

                                <button className="back" type="button" onClick={() => navigate("/forms")}>

                                    ← Back

                                </button>

                            </div>

                        </form>

                    </div>

                </main>

            </div>

            <SuccessModal

                open={showSuccess}

                onConfirm={() => {

                    setShowSuccess(false);

                    navigate("/forms");

                }}

            />

        </>

    );

}

function WorkSection({ no, title, color, p, label, form, set }) {

    const g = (key) => form[`${p}${key}`];

    const s = (key, value) => set(`${p}${key}`, value);

    return (

        <Section no={no} title={title} color={color}>

            <div className="row three">

                <Field label={`Name of ${label} Contractor`}>

                    <input

                        value={g("Contractor")}

                        onChange={(e) => s("Contractor", e.target.value)}

                    />

                </Field>

                <Field label="Contact No.">

                    <input

                        maxLength="10"

                        value={g("Contact")}

                        onChange={(e) => s("Contact", e.target.value.replace(/\D/g, ""))}

                    />

                </Field>

            </div>

            <div className="row seven">

                <Field label={`${label} TS Date`}>

                    <input

                        type="date"

                        value={g("TsDate")}

                        onChange={(e) => s("TsDate", e.target.value)}

                    />

                </Field>

                <Field label={`${label} TS Amount (Rs. Lakhs)`}>

                    <input

                        type="number"

                        value={g("TsAmount")}

                        onChange={(e) => s("TsAmount", e.target.value)}

                    />

                </Field>

                <Field label={`${label} WO Date`}>

                    <input

                        type="date"

                        value={g("WoDate")}

                        onChange={(e) => s("WoDate", e.target.value)}

                    />

                </Field>

                <Field label={`${label} WO Amount (Rs. Lakhs)`}>

                    <input

                        type="number"

                        value={g("WoAmount")}

                        onChange={(e) => s("WoAmount", e.target.value)}

                    />

                </Field>

                <TenderField

                    label={`${label} % Above/Below`}

                    percent={g("TenderPercent")}

                    type={g("TenderType")}

                    setPercent={(v) => s("TenderPercent", v)}

                    setType={(v) => s("TenderType", v)}

                />

                <Field label="Expenditure (Rs. Lakhs)">

                    <input

                        type="number"

                        value={g("Expenditure")}

                        onChange={(e) => s("Expenditure", e.target.value)}

                    />

                </Field>

                <StatusField

                    label="Work Status"

                    value={g("Status")}

                    onChange={(v) => s("Status", v)}

                />

            </div>

        </Section>

    );

}

function Section({ no, title, color, children }) {

    return (

        <section className={`section ${color}`}>

            <div className="section-title">

                <b>{no}.</b> {title}

            </div>

            <div className="section-body">{children}</div>

        </section>

    );

}

function Field({ label, required, children }) {

    return (

        <div className="field">

            <label>

                {label}

                {required && <em> *</em>}

            </label>

            {children}

        </div>

    );

}

function StatusField({ label, value, onChange, required = false }) {

    return (

        <Field label={label} required={required}>

            <select

                value={value}

                onChange={(e) => onChange(e.target.value)}

                required={required}

            >

                <option key="status-placeholder" value="">Select Status</option>

                <option key="status-completed" value="Completed">Completed</option>

                <option key="status-progress" value="In Progress">In Progress</option>

                <option key="status-not-started" value="Not Started">Not Started</option>

            </select>

        </Field>

    );

}

function TenderField({ label, percent, type, setPercent, setType }) {

    return (

        <Field label={label}>

            <div className="tender">

                <input

                    type="number"

                    step="0.01"

                    value={percent}

                    onChange={(e) => setPercent(e.target.value)}

                />

                <select value={type} onChange={(e) => setType(e.target.value)}>

                    <option key="tender-above">Above</option>

                    <option key="tender-below">Below</option>

                </select>

            </div>

        </Field>

    );

}

function ReadOnly({ label, value }) {

    return (

        <Field label={label}>

            <div className="readonly">{value}</div>

        </Field>

    );

}

function Summary({ label, value, total }) {

    return (

        <div className={total ? "sum total" : "sum"}>

            <span>{label}</span>

            <b>{value}</b>

        </div>

    );

}


